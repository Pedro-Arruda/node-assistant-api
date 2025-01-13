import { FastifyInstance } from "fastify";
import { addToDatabase } from "./add-to-database";

export const booksRoutes = async (app: FastifyInstance) => {
  app.post("/notion/books/add", addToDatabase);
};
