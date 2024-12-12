import { convertMinutesToTimeString } from "../../utils/convertMinutesToTimeString";
import { dateFormat } from "../../utils/dateFormat";
import { CreateWatchListItemNotion } from "./types";

export const createWatchListItemProperties = (
  data: CreateWatchListItemNotion
) => {
  const {
    categorie,
    duration,
    genres,
    release_date,
    streamings,
    synopsis,
    title,
    vote_average,
  } = data;

  return {
    title: {
      title: [{ text: { content: title } }],
    },
    Length: {
      rich_text: [
        {
          text: {
            content:
              typeof duration === "number"
                ? convertMinutesToTimeString(duration)
                : duration,
          },
        },
      ],
    },
    Rating: {
      rich_text: [
        {
          text: {
            content: `⭐ ${vote_average}`,
          },
        },
      ],
    },
    Streamings: {
      multi_select: streamings.map((item) => ({ name: item })),
    },
    Category: {
      relation: [{ id: categorie }],
    },
    Genres: {
      relation: genres,
    },
    Synopsis: {
      rich_text: [
        {
          text: {
            content: synopsis,
          },
        },
      ],
    },
    Release_Date: {
      rich_text: [
        {
          text: {
            content: String(dateFormat(release_date)),
          },
        },
      ],
    },
  };
};
