import { FastifyReply } from "fastify";
import { WhatsappService } from "../../../lib/whatsapp";
import { env } from "../../../env";
import { HandleWebhookEventUseCase } from "../../../use-cases/whatsapp/handle-webhook";

export const handleWebhook = async (req: any, reply: FastifyReply) => {
  const whatsappService = new WhatsappService({
    accessToken: env.WHATSAPP_ACCESS_TOKEN,
  });

  const handleWebhookEventUseCase = new HandleWebhookEventUseCase(
    whatsappService
  );

  await handleWebhookEventUseCase.execute(req.body);

  reply.status(200).send("EVENT_RECEIVED");
};
