import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { moviesRoutes } from "./http/controllers/movies/routes";
import { seriesRoutes } from "./http/controllers/series/routes";
import { authRoutes } from "./http/controllers/auth/routes";

export const app = fastify();

app.register(moviesRoutes);
app.register(seriesRoutes);
app.register(authRoutes);

app.get("/", (req, reply) => reply.send("API - Notion Assistant"));

app.post("/webhook", (req, reply) => {
  console.log("teste");
  // const incomingMessage = req.body.Body;
  // const fromNumber = req.body.From;

  // console.log(`Mensagem recebida de ${fromNumber}: ${incomingMessage}`);

  // client.messages
  //   .create({
  //     from: "whatsapp:+14155238886",
  //     body: `Você disse: "${incomingMessage}". Obrigado por interagir!`,
  //     to: fromNumber,
  //   })
  //   .then(() => {
  //     res.send("<Response></Response>");
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).send("Erro ao processar a mensagem.");
  //   });
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
  }

  return reply.status(500).send({ message: "Internal server error." });
});
