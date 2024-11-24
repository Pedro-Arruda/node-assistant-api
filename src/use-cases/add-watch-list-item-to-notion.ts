import { NotionService } from "../lib/notion";

interface AddWatchListItemUseCaseRequest {
  data: {
    image: string;
    title: string;
    duration: string | number;
    vote_average: number;
    streamings: string[];
    genres: { id: string }[];
    synopsis: string;
    release_date: string;
    categorie: string;
  };
  accessToken: string;
}

export class AddWatchListItemUseCase {
  constructor() {}

  async execute({
    data,
    accessToken,
  }: AddWatchListItemUseCaseRequest): Promise<any> {
    const notionService = new NotionService({
      accessToken,
    });

    const response = await notionService.createWatchListPage({
      ...data,
    });

    return response;
  }
}
