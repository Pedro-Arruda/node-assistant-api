import { ArtistInfo } from "../../lib/spotify/types";
import { AddItemToNotionUseCase } from "./add-item-to-notion";

interface AddArtistItemRequest extends ArtistInfo {}

export class AddArtistItemUseCase extends AddItemToNotionUseCase<AddArtistItemRequest> {
  constructor() {
    super((service, data, databaseId) =>
      service.createArtistPage(data, databaseId)
    );
  }
}
