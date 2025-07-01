import { AddItemToNotionUseCase } from "./add-item-to-notion";

interface AddTaskItemRequest {
  content: string;
}

export class AddTaskItemUseCase extends AddItemToNotionUseCase<AddTaskItemRequest> {
  constructor() {
    super((service, data, databaseId) =>
      service.createTaskPage(data, databaseId)
    );
  }
}
