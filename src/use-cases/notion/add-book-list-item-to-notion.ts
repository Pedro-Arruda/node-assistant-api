import { NotionService } from "../../lib/notion";
import { BookInfo } from "../../lib/google-books/types";

interface AddBookItemUseCaseRequest {
  data: BookInfo;
  accessToken: string;
  databaseId: string;
}

export class AddBookItemUseCase {
  constructor() {}

  async execute({
    data,
    accessToken,
    databaseId,
  }: AddBookItemUseCaseRequest): Promise<any> {
    const notionService = new NotionService({
      accessToken,
    });

    const response = await notionService.createBookListPage(data, databaseId);

    return response;
  }
}
