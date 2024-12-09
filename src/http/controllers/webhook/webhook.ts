import { FastifyReply } from "fastify";
import { WhatsappService } from "../../../lib/whatsapp";
import { env } from "../../../env";

export const handleWebhook = async (req: any, reply: FastifyReply) => {
  const body = req.body;
  const whatsappService = new WhatsappService({
    accessToken: env.WHATSAPP_ACCESS_TOKEN,
  });

  const message = req.body.entry[0].changes[0].value.messages[0];
  const sender = req.body.entry[0].changes[0].value.messages[0].from;

  console.log("message", message);

  if (
    message &&
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    const buttonId = message.interactive.button_reply.id;
    console.log("buttonId", buttonId);
    const response = await whatsappService.sendMessage(sender, buttonId);
    console.log(response);
  }

  const response = await whatsappService.sendNotionCategoriesButton(sender);
  console.log(response);

  reply.status(200).send("EVENT_RECEIVED");
};
