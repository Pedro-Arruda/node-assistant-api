import { GoogleBooksService } from "../../lib/google-books";
import { BookInfo } from "../../lib/google-books/types";

interface GetBookInfoUseCaseRequest {
  title: string;
}

interface GetBookInfoUseCaseResponse {
  details: BookInfo;
}

export class GetBookInfoUseCase {
  constructor(private googleBooksService: GoogleBooksService) {}

  async execute({
    title,
  }: GetBookInfoUseCaseRequest): Promise<GetBookInfoUseCaseResponse> {
    const { data } = await this.googleBooksService.getBookInfo(title);

    return { details: data };
  }
}
