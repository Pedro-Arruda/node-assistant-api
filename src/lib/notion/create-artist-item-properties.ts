import { CreateArtistNotion } from "./types";

export const createArtistItemProperties = (data: CreateArtistNotion) => {
  const { name, genres, followers, url } = data;

  return {
    title: {
      title: [{ text: { content: name } }],
    },
    Followers: {
      rich_text: [{ text: { content: String(followers) } }],
    },
    Genres: {
      multi_select: genres.map((genre) => ({ name: genre })),
    },
    Url: {
      url,
    },
  };
};
