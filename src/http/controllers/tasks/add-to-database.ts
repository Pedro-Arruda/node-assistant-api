import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AddTaskToNotionUseCase } from "../../../use-cases/tasks/add-task-to-notion";

const addTaskBodySchema = z.object({
  content: z.string(),
  userId: z.string(),
});

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { content, userId } = addTaskBodySchema.parse(req.body);

  const addTaskToNotionUseCase = new AddTaskToNotionUseCase();

  try {
    await addTaskToNotionUseCase.execute({ content, userId });
    reply.status(201).send({ message: `Task ${content} added.` });
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
};
