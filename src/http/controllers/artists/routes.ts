import { FastifyInstance } from "fastify";
import { addToDatabase } from "./add-to-database";

export const artistsRoutes = async (app: FastifyInstance) => {
  app.post("/notion/artists/add", addToDatabase);
};
