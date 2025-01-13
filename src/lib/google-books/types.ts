export interface IOpenLibraryService {
  getBookInfo(title: string): Promise<{ data: BookInfo }>;
}

export interface BookInfo {
  title: string;
  author: string;
  firstPublishYear: string;
  cover: string;
  description: string;
  pageCount: string;
  categories: string[];
}
