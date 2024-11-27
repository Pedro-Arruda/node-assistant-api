import { FastifyRequest, FastifyReply } from "fastify";
import { HandleWebhookEventUseCase } from "../../../use-cases/handle-webhook-event";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

export const handleWebhook = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const addSerieBodySchema = z.object({
      Body: z.string(),
      From: z.string(),
    });

    const { Body, From } = addSerieBodySchema.parse(req.body);

    console.log("From", From);

    const user = await prisma.user.findFirstOrThrow({
      where: { phone: From },
      select: { id: true },
    });

    console.log("user", user);

    const handleWebhookEventUseCase = new HandleWebhookEventUseCase();

    const result = await handleWebhookEventUseCase.execute({
      message: Body,
      userId: user.id,
    });

    reply.status(200).send({ success: true, data: result });
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    reply.status(500).send({ success: false, message: error.message });
  }
};
