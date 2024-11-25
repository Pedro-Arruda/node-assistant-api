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

    if (!userGenreDatabases || !userAccessToken) {
      throw new Error("Dados do usuário não encontrados");
    }

    return {
      genreDatabaseId: userGenreDatabases.find((db) => db.type === "genres")
        ?.notion_id,
      categoryDatabaseId: userGenreDatabases.find(
        (db) => db.type === "categories"
      )?.notion_id,
      contentsDatabaseId: userGenreDatabases.find(
        (db) => db.type === "contents"
      )?.notion_id,
      notionAccessToken: userAccessToken.notion_access_token ?? "",
    };
  }
}
