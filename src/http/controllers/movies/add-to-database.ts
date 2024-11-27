import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AddMovieToNotionUseCase } from "../../../use-cases/movies/add-movie-to-notion";

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const addSerieBodySchema = z.object({
    title: z.string(),
    userId: z.string(),
  });

  const { title, userId } = addSerieBodySchema.parse(req.body);

  const addMovieToNotionUseCase = new AddMovieToNotionUseCase();

  try {
    await addMovieToNotionUseCase.execute({ title, userId });
    reply.status(201).send({ message: `Movie ${title} added.` });
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
};
