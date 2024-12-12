import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AddAppointmentToNotionUseCase } from "../../../use-cases/appointment/add-task-to-notion";

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const addAppointmentBodySchema = z.object({
    title: z.string(),
    userId: z.string(),
  });

  const { title, userId } = addAppointmentBodySchema.parse(req.body);

  const addAppointmentToNotionUseCase = new AddAppointmentToNotionUseCase();

  try {
    // await addAppointmentToNotionUseCase.execute({
    //   content,
    //   userId,
    // });
    reply.status(201).send({ message: `Appointment ${title} added.` });
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
};
