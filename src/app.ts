import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { moviesRoutes } from "./http/controllers/movies/routes";
import { seriesRoutes } from "./http/controllers/series/routes";
import { authRoutes } from "./http/controllers/auth/routes";
import fastifyFormBody from "@fastify/formbody";

export const app = fastify();

app.register(moviesRoutes);
app.register(seriesRoutes);
app.register(authRoutes);
app.register(fastifyFormBody);

app.get("/", (req, reply) => reply.send("API - Notion Assistant"));

app.post("/webhook", async (req: any, reply) => {
  const { Body, From } = req.body;

  let responseMessage = "";

  if (
    Body.toLowerCase().includes("series") ||
    Body.toLowerCase().includes("serie")
  ) {
    responseMessage = "Sua série será adicionada!";

    const serieTitle = Body.toLowerCase()
      .replace("series", "")
      .replace("serie", "")
      .trim();

    await app.inject({
      method: "POST",
      url: "/notion/series/add",
      payload: {
        title: serieTitle,
        // userId: "148675fb-5be0-8106-9139-f5ee787343ae",
        userId: "08d1c145-5ed9-4830-9c82-bd519bc0a4cd",
      },
    });
  } else if (
    Body.toLowerCase().includes("filmes") ||
    Body.toLowerCase().includes("filme")
  ) {
    responseMessage = "Seu filme será adicionado!";

    await app.inject({
      method: "POST",
      url: "/notion/movies/add",
      payload: {
        title: Body.toLowerCase().replace("filmes", "").replace("filme", ""),
      },
    });
  }

  reply.send(responseMessage);
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
