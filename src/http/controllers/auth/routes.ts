import { FastifyInstance } from "fastify";
import { callback } from "./callback";

export const authRoutes = async (app: FastifyInstance) => {
  app.get("/notion/auth/callback", callback);
};
