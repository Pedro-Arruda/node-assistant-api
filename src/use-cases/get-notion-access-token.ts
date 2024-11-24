import { NotionService } from "../lib/notion";

interface GetNotionAccessTokenUseCaseRequest {
  code: string;
}

export class GetNotionAccessTokenUseCase {
  constructor() {}

  async execute({ code }: GetNotionAccessTokenUseCaseRequest): Promise<any> {
    const notionService = new NotionService({
      accessToken: "",
    });

    const data = await notionService.getAccessToken({
      code,
    });

    return data;
  }
}
