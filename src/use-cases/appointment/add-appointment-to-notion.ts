import { GetUserDataUseCase } from "../user/get-user-data";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-user";
import { AddAppointmentItemUseCase } from "../notion/add-appointment-item-to-notion";

export class AddAppointmentToNotionUseCase {
  async execute({ title, userId }: { title: string; userId: string }) {
    const userNotionData = await this.getUserNotionData(userId);

    return this.addToAppointments({
      userNotionData,
      title,
    });
  }

  private async getUserNotionData(userId: string) {
    const usersRepository = new PrismaUsersRepository();
    const getUserNotionData = new GetUserDataUseCase(usersRepository);
    return await getUserNotionData.execute(userId);
  }

  private async addToAppointments({
    userNotionData,
    title,
  }: {
    userNotionData: any;
    title: string;
  }) {
    const addAppointmentUseCase = new AddAppointmentItemUseCase();

    return await addAppointmentUseCase.execute({
      data: {
        title,
      },
      accessToken: userNotionData.accessToken,
      databaseId: userNotionData.calendarDatabase.notion_id,
    });
  }
}
