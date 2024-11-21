import { FastifyInstance } from "fastify";
import { addToDatabase } from "./add-to-database";

export const moviesRoutes = async (app: FastifyInstance) => {
  app.post("/notion/movies/add", addToDatabase);
};
