import { NotionService } from "../lib/notion-api";

export class GetUserNotionDatabasesIdUseCase {
  constructor() {}

  async execute(accessToken: string): Promise<any> {
    const notionService = new NotionService({
      accessToken: accessToken,
    });

    const databases = await notionService.getUserDatabasesId();

    return databases;
  }
}
