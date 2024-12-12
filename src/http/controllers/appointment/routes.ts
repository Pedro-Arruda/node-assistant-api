import { FastifyInstance } from "fastify";
import { addToDatabase } from "./add-to-database";

export const appointmentRoutes = async (app: FastifyInstance) => {
  app.post("/notion/appointment/add", addToDatabase);
};
