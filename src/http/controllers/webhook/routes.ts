import { FastifyInstance } from "fastify";
import { handleWebhook } from "./webhook";

export const webhookRoutes = async (app: FastifyInstance) => {
  app.post("/webhook", handleWebhook);

  app.get("/webhook", (req: any, res) => {
    const VERIFY_TOKEN = "notion-assistant-api";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado com sucesso!");

      res.status(200).send(challenge);
    } else {
      res.status(403).send("Erro de verificação");
    }
  });
};
