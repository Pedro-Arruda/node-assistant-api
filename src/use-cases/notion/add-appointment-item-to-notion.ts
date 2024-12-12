import { NotionService } from "../../lib/notion";

interface AddAppointmentItemUseCaseRequest {
  data: {
    title: string;
  };
  accessToken: string;
  databaseId: string;
}

export class AddAppointmentItemUseCase {
  constructor() {}

  async execute({
    data,
    accessToken,
    databaseId,
  }: AddAppointmentItemUseCaseRequest): Promise<any> {
    const notionService = new NotionService({
      accessToken,
    });

    const response = await notionService.createAppointmentPage(
      data,
      databaseId
    );

    return response;
  }
}
