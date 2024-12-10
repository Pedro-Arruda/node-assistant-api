import { FastifyInstance } from "fastify";
import { addToDatabase } from "./add-to-database";

export const tasksRoutes = async (app: FastifyInstance) => {
  app.post("/notion/tasks/add", addToDatabase);
};
