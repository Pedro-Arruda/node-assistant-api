import { FastifyInstance } from "fastify";
import { addToDatabase } from "./add-to-database";

export const seriesRoutes = async (app: FastifyInstance) => {
  app.post("/notion/series/add", addToDatabase);
};
