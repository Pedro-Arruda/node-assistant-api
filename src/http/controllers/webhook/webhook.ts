import { FastifyReply, FastifyRequest } from "fastify";
import { HandleWebhookEventUseCase } from "../../../use-cases/webhook/handle-webhook-event";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

export const handleWebhook = async (req: any, reply: FastifyReply) => {
  console.log("WEBHOOK");

  console.log(req.body);

  // const url = `https://graph.facebook.com/v21.0/485600487973744/messages`;

  // const data = {
  //   messaging_product: "whatsapp",
  //   to: "5514998861503",
  //   text: { body: "TESTEEEEE" },
  // };

  // const response = await fetch(url, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer EAAIeVdZAIBC4BO5R4ALgQ32OxWHgaEYkZC0gdz7Wy7S9TMAkOhg8TimKlAN8ZB8ST92Olj6t6IArCvISQYg0FKr7Liu7VOBjnwPbfWEjnJokv0XmTqUvI0Ngd73gdSjXSyoTC9f5Sxy0iwH4llk2iI0ywgzzWqswjH43jK14TAycZCVwmVXraeV1Q0MNWfZAuPOAgFNDT9koSbLOy1SUedj9oZAKMZD`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((response) => {
  //     console.log("Mensagem enviada com sucesso:", response);
  //   })
  //   .catch((error) => {
  //     console.error("Erro ao enviar mensagem:", error.response.data);
  //   });

  // try {
  //   const addSerieBodySchema = z.object({
  //     Body: z.string(),
  //     From: z.string(),
  //   });

  //   const { Body, From } = addSerieBodySchema.parse(req.body);

  //   const user = await prisma.user.findFirstOrThrow({
  //     where: { phone: From.replace(/\D/g, "") },
  //     select: { id: true },
  //   });

  //   const handleWebhookEventUseCase = new HandleWebhookEventUseCase();
  //   await handleWebhookEventUseCase
  //     .execute({
  //       message: Body,
  //       userId: user.id,
  //     })
  //     .catch((error) => {
  //       console.error("Erro ao processar o evento do webhook:", error);
  //     });

  //   reply.type("text/xml").status(200).send(`
  //       <Response>
  //         <Message>Sua série está sendo inserida.</Message>
  //       </Response>
  //     `);
  // } catch (error: any) {
  //   console.error("Erro ao lidar com webhook:", error);

  //   reply.type("text/xml").status(200).send(`
  //       <Response>
  //         <Message>Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.</Message>
  //       </Response>
  //     `);
  // }
};
