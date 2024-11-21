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

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // external log like DataDog
  }

  return reply.status(500).send({ message: "Internal server error." });
});
