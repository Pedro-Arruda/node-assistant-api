import { prisma } from "../lib/prisma";

export class GetUserNotionData {
  async execute(userId: string) {
    const userGenreDatabases = await prisma.notionDatabase.findMany({
      where: { user_id: userId },
      select: { notion_id: true, type: true },
    });

    const userAccessToken = await prisma.user.findFirst({
      where: { id: userId },
      select: { notion_access_token: true },
    });

    if (
      !userGenreDatabases ||
      !userAccessToken ||
      !userAccessToken.notion_access_token
    ) {
      throw new Error("Dados do usuário não encontrados");
    }

    const genreDatabase = userGenreDatabases.find((db) => db.type === "genres");

    const categoryDatabase = userGenreDatabases.find(
      (db) => db.type === "categories"
    );

    const contentsDatabase = userGenreDatabases.find(
      (db) => db.type === "contents"
    );

    if (!genreDatabase || !categoryDatabase || !contentsDatabase) {
      throw new Error("Databases não encontrados");
    }

    return {
      genreDatabase,
      categoryDatabase,
      contentsDatabase,
      accessToken: userAccessToken.notion_access_token,
    };
  }
}
