import { AddTaskItemUseCase } from "../notion/add-task-item-to-notion";
import { UserService } from "../../services/user-service";

export class AddTaskToNotionUseCase {
  constructor(private userService: UserService = new UserService()) {}

  async execute({ content, userId }: { content: string; userId: string }) {
    const userNotionData = await this.userService.getUserNotionData(userId);

    return this.addToTasks({
      userNotionData,
      content,
    });
  }

  private async addToTasks({
    userNotionData,
    content,
  }: {
    userNotionData: any;
    content: string;
  }) {
    const addTaskUseCase = new AddTaskItemUseCase();
    return await addTaskUseCase.execute({
      data: {
        content,
      },
      accessToken: userNotionData.accessToken,
      databaseId: userNotionData.tasksDatabase.notion_id,
    });
  }
}
