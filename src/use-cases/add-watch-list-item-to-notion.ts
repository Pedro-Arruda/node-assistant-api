import { NotionService } from "../lib/notion-api";

interface AddWatchListItemUseCaseRequest {
  image: string;
  title: string;
  duration: string | number;
  vote_average: number;
  streamings: string[];
  genres: string[];
  synopsis: string;
  release_date: string;
  categorie: string;
}

export class AddWatchListItemUseCase {
  constructor() {}

  async execute({
    title,
    duration,
    image,
    release_date,
    streamings,
    synopsis,
    vote_average,
    genres,
    categorie,
  }: AddWatchListItemUseCaseRequest): Promise<any> {
    const notionService = new NotionService({
      accessToken: "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",
      databaseId: "145675fb5be08102bb11eb539a33a787",
    });

    const response = await notionService.createWatchListPage({
      title,
      duration,
      image,
      release_date,
      streamings,
      synopsis,
      vote_average,
      genres,
      categorie,
    });

    return response;
  }
}
