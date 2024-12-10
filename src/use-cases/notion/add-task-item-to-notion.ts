import { NotionService } from "../../lib/notion";

interface AddTaskItemUseCaseRequest {
  data: {
    content: string;
  };
  accessToken: string;
  databaseId: string;
}

export class AddTaskItemUseCase {
  constructor() {}

  async execute({
    data,
    accessToken,
    databaseId,
  }: AddTaskItemUseCaseRequest): Promise<any> {
    const notionService = new NotionService({
      accessToken,
    });

    const response = await notionService.createTaskPage(data, databaseId);

    return response;
  }
}
