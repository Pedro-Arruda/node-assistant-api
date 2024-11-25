import { FastifyInstance } from "fastify";
import { handleWebhook } from "./webhook";

export const webhookRoutes = async (app: FastifyInstance) => {
  app.post("/webhook", handleWebhook);
};
