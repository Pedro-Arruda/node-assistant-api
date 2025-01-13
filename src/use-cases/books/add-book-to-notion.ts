import { GoogleBooksService } from "../../lib/google-books";
import { BookInfo } from "../../lib/google-books/types";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-user";
import { GetBookInfoUseCase } from "../books/get-info";
import { AddBookItemUseCase } from "../notion/add-book-list-item-to-notion";
import { GetUserDataUseCase } from "../user/get-user-data";

export class AddBookToNotionUseCase {
  async execute({ title, userId }: { title: string; userId: string }) {
    const { details } = await this.getBookInfos(title);

    const userNotionData = await this.getUserNotionData(userId);

    return await this.addToBooklist({
      bookInfos: details,
      userNotionData,
    });
  }

  private async getBookInfos(title: string) {
    const bookApiService = new GoogleBooksService(
      "AIzaSyCSD5DgEDcDEKA1zIWNw_a8VD8ag-ZUj6s"
    );
    const getBookDetailsUseCase = new GetBookInfoUseCase(bookApiService);
    return await getBookDetailsUseCase.execute({ title });
  }

  private async getUserNotionData(userId: string) {
    const usersRepository = new PrismaUsersRepository();
    const getUserNotionData = new GetUserDataUseCase(usersRepository);
    return await getUserNotionData.execute(userId);
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
