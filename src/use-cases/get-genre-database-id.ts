import { NotionService } from "../lib/notion";

interface GetGenreDatabaseIdUseCaseProps {
  genresDatabaseId: string;
}

export class GetGenreDatabaseIdUseCase {
  private genresDatabaseId: string;

  constructor({ genresDatabaseId }: GetGenreDatabaseIdUseCaseProps) {
    this.genresDatabaseId = genresDatabaseId;
  }

  async execute(accessToken: string): Promise<Record<string, string>> {
    const notionService = new NotionService({ accessToken });

    const genres = await notionService.getDatabasesPages(this.genresDatabaseId);

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
