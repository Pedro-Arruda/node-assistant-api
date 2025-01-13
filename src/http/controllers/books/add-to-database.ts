import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AddBookToNotionUseCase } from "../../../use-cases/books/add-book-to-notion";

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const addBookBodySchema = z.object({
    title: z.string(),
    userId: z.string(),
  });

  const { title, userId } = addBookBodySchema.parse(req.body);

  const addBookToNotionUseCase = new AddBookToNotionUseCase();

  try {
    await addBookToNotionUseCase.execute({ title, userId });
    reply.status(201).send({ message: `Book ${title} added.` });
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
};
