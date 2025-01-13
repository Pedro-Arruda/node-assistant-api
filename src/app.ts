import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { moviesRoutes } from "./http/controllers/movies/routes";
import { seriesRoutes } from "./http/controllers/series/routes";
import { authRoutes } from "./http/controllers/auth/routes";
import fastifyFormBody from "@fastify/formbody";
import { webhookRoutes } from "./http/controllers/webhook/routes";
import { tasksRoutes } from "./http/controllers/tasks/routes";
import { appointmentRoutes } from "./http/controllers/appointments/routes";
import { booksRoutes } from "./http/controllers/books/routes";

export const app = fastify();

app.register(fastifyFormBody);

app.get("/", (req, reply) => reply.send("API - Notion Assistant"));
app.register(moviesRoutes);
app.register(seriesRoutes);
app.register(authRoutes);
app.register(webhookRoutes);
app.register(tasksRoutes);
app.register(appointmentRoutes);
app.register(booksRoutes);

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
