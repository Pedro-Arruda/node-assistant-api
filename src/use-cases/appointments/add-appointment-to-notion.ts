import { AddAppointmentItemUseCase } from "../notion/add-appointment-item-to-notion";
import { UserService } from "../../services/user-service";

export class AddAppointmentToNotionUseCase {
  constructor(private userService: UserService = new UserService()) {}

  async execute({ title, userId }: { title: string; userId: string }) {
    const userNotionData = await this.userService.getUserNotionData(userId);

    return this.addToAppointments({
      userNotionData,
      title,
    });
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
