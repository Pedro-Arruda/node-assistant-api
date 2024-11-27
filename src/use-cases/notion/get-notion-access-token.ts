import { NotionService } from "../../lib/notion";

interface GetNotionAccessTokenUseCaseRequest {
  code: string;
}

export class GetNotionAccessTokenUseCase {
  constructor() {}

  async execute({ code }: GetNotionAccessTokenUseCaseRequest) {
    const notionService = new NotionService({
      accessToken: "",
    });

    const { access_token, owner } = await notionService.getAccessToken(code);

    return { access_token, owner };
  }
}
