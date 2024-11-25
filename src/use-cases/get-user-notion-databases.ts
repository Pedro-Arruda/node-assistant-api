import { NotionService } from "../lib/notion";

export class GetUserNotionDatabasesIdUseCase {
  constructor() {}

  async execute(accessToken: string): Promise<any> {
    const notionService = new NotionService({
      accessToken: accessToken,
    });

    const databases = await notionService.getUserDatabases();

    return databases;
  }
}
