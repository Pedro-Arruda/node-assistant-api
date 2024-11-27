import { NotionService } from "../../lib/notion";

export class GetNotionDatabasesUseCase {
  constructor() {}

  async execute(accessToken: string) {
    const notionService = new NotionService({
      accessToken: accessToken,
    });

    const databases = await notionService.getNotionDatabases();

    return databases;
  }
}
