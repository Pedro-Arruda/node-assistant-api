import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { GetNotionAccessTokenUseCase } from "../../../use-cases/notion/get-notion-access-token";
import { GetNotionDatabasesUseCase } from "../../../use-cases/notion/get-notion-databases";

export const callback = async (req: FastifyRequest, reply: FastifyReply) => {
  const addMovieQuerySchema = z.object({
    code: z.string(),
  });

  const { code } = addMovieQuerySchema.parse(req.query);

  const getNotionAccessTokenUseCase = new GetNotionAccessTokenUseCase();

  try {
    const response = await getNotionAccessTokenUseCase.execute({
      code,
    });

    const user = await prisma.user.create({
      data: {
        email: response.owner.user.person.email,
        name: response.owner.user.name,
        notion_access_token: response.access_token,
      },
    });

    const getUserDatabasesUseCase = new GetNotionDatabasesUseCase();

    const { databases } = await getUserDatabasesUseCase.execute(
      response.access_token
    );

    const databasesToCreate = databases.map((database) => ({
      notion_id: database.id,
      type: database.type,
      user_id: user.id,
    }));

    await prisma.notionDatabase.createMany({
      data: databasesToCreate,
    });

    reply.redirect(`http://localhost:5173/success`);
  } catch (error: any) {
    console.error(error);
    reply.status(400).send({ error: error.message });
  }
};
