import { BookInfo, IOpenLibraryService } from "./types";

export class GoogleBooksService implements IOpenLibraryService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getBookInfo(title: string) {
    const formattedTitle = title.toLowerCase().replaceAll(" ", "+");

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${formattedTitle}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        // const exactNameBook = data.items.find((book: any) =>
        //   book.volumeInfo.title.toLowerCase().includes(title.toLowerCase())
        // );

        const booksWithCover = data.items.filter(
          (book: any) => book.volumeInfo.imageLinks
        );

        console.log(booksWithCover);
        

        const exactNameBook = booksWithCover.find((book: any) =>
          book.volumeInfo.title.toLowerCase().includes(title.toLowerCase())
        );

        const book = exactNameBook
          ? exactNameBook.volumeInfo
          : booksWithCover[0].volumeInfo;

        const bookInfo: BookInfo = {
          title: book.title || "Título não disponível",
          author: book.authors ? `✍ ${book.authors[0]}` : "",
          firstPublishYear: book.publishedDate
            ? book.publishedDate.split("-")[0]
            : "",
          cover: book.imageLinks
            ? book.imageLinks.thumbnail
            : "https://plus.unsplash.com/premium_photo-1664006988924-16f386bcd40e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D",
          description: book.description ?? "",
          pageCount: `${book.pageCount} páginas`,
          categories: book.categories || [],
        };

        return { data: bookInfo };
      } else {
        throw new Error("Nenhum livro encontrado para o título fornecido.");
      }
    } catch (error) {
      console.error(error);

      throw new Error("Erro ao buscar informações do livro.");
    }
  }
}
