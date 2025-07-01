import { GoogleBooksService } from "../../lib/google-books";
import { BookInfo } from "../../lib/google-books/types";
import { GetBookInfoUseCase } from "../books/get-info";
import { AddBookItemUseCase } from "../notion/add-book-list-item-to-notion";
import { UserService } from "../../services/user-service";

export class AddBookToNotionUseCase {
  constructor(
    private userService: UserService = new UserService(),
    private booksService: GoogleBooksService = new GoogleBooksService(
      "AIzaSyCSD5DgEDcDEKA1zIWNw_a8VD8ag-ZUj6s"
    )
  ) {}

  async execute({ title, userId }: { title: string; userId: string }) {
    const { details } = await this.getBookInfos(title);

    const userNotionData = await this.userService.getUserNotionData(userId);

    return await this.addToBooklist({
      bookInfos: details,
      userNotionData,
    });
  }

  private async getBookInfos(title: string) {
    const getBookDetailsUseCase = new GetBookInfoUseCase(this.booksService);
    return await getBookDetailsUseCase.execute({ title });
  }

  private async addToBooklist({
    bookInfos,
    userNotionData,
  }: {
    bookInfos: BookInfo;
    userNotionData: any;
  }) {
    const addBookListUseCase = new AddBookItemUseCase();
    return await addBookListUseCase.execute({
      data: {
        author: bookInfos.author,
        cover: bookInfos.cover,
        firstPublishYear: bookInfos.firstPublishYear,
        title: bookInfos.title,
        categories: bookInfos.categories,
        description: bookInfos.description,
        pageCount: bookInfos.pageCount,
      },
      accessToken: userNotionData.accessToken,
      databaseId: userNotionData.booksDatabase.notion_id,
    });
  }
}
