import { FastifyReply } from "fastify";
import { WhatsappService } from "../../../lib/whatsapp";
import { env } from "../../../env";
import { HandleWebhookEventUseCase } from "../../../use-cases/whatsapp/handle-webhook";
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-user";
import { PrismaUsersMessageRepository } from "../../../repositories/prisma/prisma-user-messages";

export const handleWebhook = async (req: any, reply: FastifyReply) => {
  console.log("req.body", req.body);

  const whatsappService = new WhatsappService({
    accessToken: env.WHATSAPP_ACCESS_TOKEN,
  });

  const usersRepository = new PrismaUsersRepository();
  const usersMessagesRepository = new PrismaUsersMessageRepository();

  const handleWebhookEventUseCase = new HandleWebhookEventUseCase(
    whatsappService,
    usersRepository,
    usersMessagesRepository
  );

  await handleWebhookEventUseCase.execute(req.body);

  reply.status(200).send("EVENT_RECEIVED");
};
