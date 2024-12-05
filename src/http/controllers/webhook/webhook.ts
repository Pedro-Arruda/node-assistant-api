import { FastifyReply, FastifyRequest } from "fastify";
import { HandleWebhookEventUseCase } from "../../../use-cases/webhook/handle-webhook-event";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

async function sendMessage(to: number, message: string) {
  const url = `https://graph.facebook.com/v21.0/485600487973744/messages`;

  const data = {
    messaging_product: "whatsapp",
    to,
    text: { body: message },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer EAAIeVdZAIBC4BO5R4ALgQ32OxWHgaEYkZC0gdz7Wy7S9TMAkOhg8TimKlAN8ZB8ST92Olj6t6IArCvISQYg0FKr7Liu7VOBjnwPbfWEjnJokv0XmTqUvI0Ngd73gdSjXSyoTC9f5Sxy0iwH4llk2iI0ywgzzWqswjH43jK14TAycZCVwmVXraeV1Q0MNWfZAuPOAgFNDT9koSbLOy1SUedj9oZAKMZD`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    console.log("Mensagem enviada com sucesso:", await response.json());
  } else {
    console.error("Erro ao enviar mensagem:", await response.text());
  }
}

export const handleWebhook = async (req: any, reply: FastifyReply) => {
  const url = `https://graph.facebook.com/v21.0/485600487973744/messages`;

  const sender = req.body.entry[0].changes[0].value.messages[0].from;

  const messageText = req.body.entry[0].changes[0].value.messages[0].text.body;

  const messagePayload = {
    messaging_product: "whatsapp",
    to: sender,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "Escolha uma opção",
      },
      body: {
        text: "Por favor, selecione uma opção abaixo.",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "series",
              title: "Séries",
            },
          },
          {
            type: "reply",
            reply: {
              id: "movies",
              title: "Filmes",
            },
          },
          {
            type: "reply",
            reply: {
              id: "tasks",
              title: "Tarefas",
            },
          },
          {
            type: "reply",
            reply: {
              id: "compromissos",
              title: "Compo",
            },
          },
        ],
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer EAAIeVdZAIBC4BO5R4ALgQ32OxWHgaEYkZC0gdz7Wy7S9TMAkOhg8TimKlAN8ZB8ST92Olj6t6IArCvISQYg0FKr7Liu7VOBjnwPbfWEjnJokv0XmTqUvI0Ngd73gdSjXSyoTC9f5Sxy0iwH4llk2iI0ywgzzWqswjH43jK14TAycZCVwmVXraeV1Q0MNWfZAuPOAgFNDT9koSbLOy1SUedj9oZAKMZD`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messagePayload),
  });
  reply.status(200).send("EVENT_RECEIVED");
};
