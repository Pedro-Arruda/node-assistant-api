import { GetUserDataUseCase } from "../user/get-user-data";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-user";
import { AddTaskItemUseCase } from "../notion/add-task-item-to-notion";

export class AddTaskToNotionUseCase {
  async execute({ content, userId }: { content: string; userId: string }) {
    const userNotionData = await this.getUserNotionData(userId);

    return this.addToTasks({
      userNotionData,
      content,
    });
  }

  private async getUserNotionData(userId: string) {
    const usersRepository = new PrismaUsersRepository();
    const getUserNotionData = new GetUserDataUseCase(usersRepository);
    return await getUserNotionData.execute(userId);
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
