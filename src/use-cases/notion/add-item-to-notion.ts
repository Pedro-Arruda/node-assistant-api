import { NotionService } from "../../lib/notion";

export interface AddItemToNotionRequest<T> {
  data: T;
  accessToken: string;
  databaseId: string;
}

export type CreatePageFunction<T> = (
  service: NotionService,
  data: T,
  databaseId: string
) => Promise<any>;

export class AddItemToNotionUseCase<T> {
  constructor(private createPageFn: CreatePageFunction<T>) {}

  async execute({
    data,
    accessToken,
    databaseId,
  }: AddItemToNotionRequest<T>): Promise<any> {
    const notionService = new NotionService({ accessToken });
    return await this.createPageFn(notionService, data, databaseId);
  }
}

