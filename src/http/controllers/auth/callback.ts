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

  const { access_token, owner } = await getNotionAccessTokenUseCase.execute({
    code,
  });

  const user = await prisma.user.create({
    data: {
      email: owner.user.person.email,
      name: owner.user.name,
      notion_access_token: access_token,
    },
  });

  const getUserDatabasesUseCase = new GetNotionDatabasesUseCase();

  const { databases } = await getUserDatabasesUseCase.execute(access_token);

  await prisma.notionDatabase.createMany({
    data: [
      {
        notion_id: databases[0].id,
        type: databases[0].title,
        user_id: user.id,
      },
      {
        notion_id: databases[1].id,
        type: databases[1].title,
        user_id: user.id,
      },
      {
        notion_id: databases[2].id,
        type: databases[2].title,
        user_id: user.id,
      },
    ],
  });

  reply.redirect(`http://localhost:5173/success`);
};
