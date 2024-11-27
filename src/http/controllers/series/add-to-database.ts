import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AddSerieToNotionUseCase } from "../../../use-cases/series/add-serie-to-notion";

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const addSerieBodySchema = z.object({
    title: z.string(),
    userId: z.string(),
  });

  const { title, userId } = addSerieBodySchema.parse(req.body);

  const addSerieToNotionUseCase = new AddSerieToNotionUseCase();

  try {
    await addSerieToNotionUseCase.execute({ title, userId });
    reply.status(201).send({ message: `Serie ${title} added.` });
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
};
