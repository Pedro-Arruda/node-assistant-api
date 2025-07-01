import { NotionService } from "../../lib/notion";
import { ArtistInfo } from "../../lib/spotify/types";

interface AddArtistItemUseCaseRequest {
  data: ArtistInfo;
  accessToken: string;
  databaseId: string;
}

export class AddArtistItemUseCase {
  constructor() {}

  async execute({ data, accessToken, databaseId }: AddArtistItemUseCaseRequest) {
    const notionService = new NotionService({ accessToken });
    const response = await notionService.createArtistPage(data, databaseId);
    return response;
  }
}
