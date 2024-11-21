import { env } from "../../env";

interface FetchMovieApiParams {
  endpoint: string;
}

export const fetchItemApi = async ({ endpoint }: FetchMovieApiParams) => {
  const url = `${env.BASE_MOVIE_API_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.MOVIE_API_KEY}`,
    },
  });

  return response;
};
