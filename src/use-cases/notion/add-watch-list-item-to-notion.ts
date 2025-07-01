import { AddItemToNotionUseCase } from "./add-item-to-notion";

interface AddWatchListItemRequest {
  image: string;
  title: string;
  duration: string | number;
  vote_average: number;
  streamings: string[];
  genres: { id: string }[];
  synopsis: string;
  release_date: string;
  categorie: string;
}

export class AddWatchListItemUseCase extends AddItemToNotionUseCase<AddWatchListItemRequest> {
  constructor() {
    super((service, data, databaseId) =>
      service.createWatchListPage(data, databaseId)
    );
  }
}
