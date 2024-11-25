import { FastifyRequest, FastifyReply } from "fastify";
import { HandleWebhookEventUseCase } from "../../../use-cases/handle-webhook-event";
import { z } from "zod";

export const handleWebhook = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const addSerieBodySchema = z.object({
      Body: z.string(),
      userId: z.string(),
    });

    const { Body, userId } = addSerieBodySchema.parse(req.body);

    const handleWebhookEventUseCase = new HandleWebhookEventUseCase();
    const result = await handleWebhookEventUseCase.execute({
      message: Body,
      userId,
    });

    reply.status(200).send({ success: true, data: result });
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    reply.status(500).send({ success: false, message: error.message });
  }
};
