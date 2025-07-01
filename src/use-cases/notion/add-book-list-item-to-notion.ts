import { BookInfo } from "../../lib/google-books/types";
import { AddItemToNotionUseCase } from "./add-item-to-notion";

interface AddBookItemRequest extends BookInfo {}

export class AddBookItemUseCase extends AddItemToNotionUseCase<AddBookItemRequest> {
  constructor() {
    super((service, data, databaseId) =>
      service.createBookListPage(data, databaseId)
    );
  }
}
