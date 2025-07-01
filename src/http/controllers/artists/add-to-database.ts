import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AddArtistToNotionUseCase } from "../../../use-cases/artists/add-artist-to-notion";

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const addArtistBodySchema = z.object({
    name: z.string(),
    userId: z.string(),
  });

  const { name, userId } = addArtistBodySchema.parse(req.body);

  const addArtistToNotionUseCase = new AddArtistToNotionUseCase();

  try {
    await addArtistToNotionUseCase.execute({ name, userId });
    reply.status(201).send({ message: `Artist ${name} added.` });
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
};
