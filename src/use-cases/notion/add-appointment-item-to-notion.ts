import { AddItemToNotionUseCase } from "./add-item-to-notion";

interface AddAppointmentItemRequest {
  title: string;
}

export class AddAppointmentItemUseCase extends AddItemToNotionUseCase<AddAppointmentItemRequest> {
  constructor() {
    super((service, data, databaseId) =>
      service.createAppointmentPage(data, databaseId)
    );
  }
}
