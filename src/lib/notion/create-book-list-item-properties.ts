import { BookInfo } from "../google-books/types";

export const createBookItemProperties = (data: BookInfo) => {
  const {
    author,
    categories,
    title,
    description,
    pageCount,
    firstPublishYear,
  } = data;

  return {
    title: {
      title: [{ text: { content: title } }],
    },
    Release_Date: {
      rich_text: [
        {
          text: {
            content: String(firstPublishYear),
          },
        },
      ],
    },
    Author: {
      rich_text: [
        {
          text: {
            content: author,
          },
        },
      ],
    },
    Full_Description: {
      rich_text: [
        {
          text: {
            content: description.substring(0, 1997).trimEnd().concat("...") || "",
          },
        },
      ],
    },
    Shorted_Description: {
      rich_text: [
        {
          text: {
            content: description
              ? description.substring(0, 100).trimEnd().concat("...")
              : "",
          },
        },
      ],
    },
    PageCount: {
      rich_text: [
        {
          text: {
            content: pageCount,
          },
        },
      ],
    },
    Categories: {
      multi_select: categories.map((item) => ({ name: item })),
    },
  };
};
