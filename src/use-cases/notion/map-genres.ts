import { NotionService } from "../../lib/notion";

interface MapGenreUseCaseProps {
  genresDatabaseId: string;
}

export class MapGenreUseCase {
  private genresDatabaseId: string;

  constructor({ genresDatabaseId }: MapGenreUseCaseProps) {
    this.genresDatabaseId = genresDatabaseId;
  }

  async execute(accessToken: string): Promise<Record<string, string>> {
    const notionService = new NotionService({ accessToken });

    const genres = await notionService.getDatabasePages(this.genresDatabaseId);

    const genreMap: Record<string, string> = {};
    genres.results.forEach((page: any) => {
      const genreName = page.properties.Name.title[0]?.plain_text;
      if (genreName) {
        genreMap[genreName] = page.id;
      }
    });

    return genreMap;
  }
}
