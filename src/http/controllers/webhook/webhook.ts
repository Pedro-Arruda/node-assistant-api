import { FastifyReply, FastifyRequest } from "fastify";
import { HandleWebhookEventUseCase } from "../../../use-cases/webhook/handle-webhook-event";
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

    const user = await prisma.user.findFirstOrThrow({
      where: { phone: From.replace(/\D/g, "") },
      select: { id: true },
    });

    const handleWebhookEventUseCase = new HandleWebhookEventUseCase();
    handleWebhookEventUseCase
      .execute({
        message: Body,
        userId: user.id,
      })
      .catch((error) => {
        console.error("Erro ao processar o evento do webhook:", error);
      });

    reply.type("text/xml").status(200).send(`
        <Response>
          <Message>Sua série está sendo inserida.</Message>
        </Response>
      `);
  } catch (error: any) {
    console.error("Erro ao lidar com webhook:", error);

    reply.type("text/xml").status(200).send(`
        <Response>
          <Message>Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.</Message>
        </Response>
      `);
  }
};
