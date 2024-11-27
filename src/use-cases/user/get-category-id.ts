import { NotionService } from "../../lib/notion";

interface GetCategoryIdUseCaseProps {
  categoryDatabaseId: string;
}

export class GetCategoryIdUseCase {
  private categoryDatabaseId: string;

  constructor({ categoryDatabaseId }: GetCategoryIdUseCaseProps) {
    this.categoryDatabaseId = categoryDatabaseId;
  }

  async execute(accessToken: string) {
    const notionService = new NotionService({ accessToken });

    const { results } = await notionService.getDatabasePages(
      this.categoryDatabaseId
    );

    return results;
  }
}
