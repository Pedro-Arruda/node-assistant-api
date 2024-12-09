import { FastifyReply } from "fastify";
import { WhatsappService } from "../../../lib/whatsapp";
import { env } from "../../../env";

export const handleWebhook = async (req: any, reply: FastifyReply) => {
  const body = req.body;
  const whatsappService = new WhatsappService({
    accessToken: env.WHATSAPP_ACCESS_TOKEN,
  });

  if (body.object === "whatsapp_business_account") {
    body.entry.forEach((entry: any) => {
      entry.changes.forEach((change: any) => {
        const message = change.value.messages && change.value.messages[0];
        if (
          message &&
          message.type === "interactive" &&
          message.interactive.type === "button_reply"
        ) {
          const buttonId = message.interactive.button_reply.id;
          console.log("buttonId", buttonId);
        }
      });
    });
  }

  const sender = req.body.entry[0].changes[0].value.messages[0].from;

  const response = await whatsappService.sendNotionCategoriesButton(sender);
  console.log(response);

  reply.status(200).send("EVENT_RECEIVED");
};
