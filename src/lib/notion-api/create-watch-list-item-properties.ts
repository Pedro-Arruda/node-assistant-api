import { CreateWatchListItemNotion } from ".";
import { convertMinutesToTimeString } from "../../utils/convertMinutesToTimeString";
import { dateFormat } from "../../utils/dateFormat";
import { prisma } from "../prisma";

export const createWatchListItemProperties = async ({
  title,
  duration,
  vote_average,
  streamings,
  synopsis,
  release_date,
  genres,
  categorie,
}: CreateWatchListItemNotion) => {
  const userId = "301131a6-01eb-40c5-bb82-760fd59f09e9";
  const genresId = await prisma.notionPagesGenres.findMany({
    where: {
      user_id: userId,
      genre: {
        in: genres,
      },
    },
    select: { page_id: true },
  });

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
      relation: genresId.map((genre) => ({ id: genre.page_id })),
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
