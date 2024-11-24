import { fetchItemApi } from "./fetch-movie-api";
import {
  IMovieDatabaseService,
  MovieDetails,
  ItemWatchProviders,
  SerieDetails,
} from "./types";

export class MovieApiDatabaseService implements IMovieDatabaseService {
  constructor() {}

  async getMovieIdByTitle(title: string) {
    const titleWithoutSpaces = title.replaceAll(" ", "%");

    try {
      const response = await fetchItemApi({
        endpoint: `/search/movie?query=${titleWithoutSpaces}`,
      });

      const data = await response.json();

      return { id: data.results[0].id };
    } catch (error) {
      console.error("Error getting the id of the movie:", error);
      throw new Error("Error getting the id of the movie.");
    }
  }

  async getMovieDetails(id: string): Promise<{ details: MovieDetails }> {
    try {
      const response = await fetchItemApi({
        endpoint: `/movie/${id}?language=pt-br`,
      });

      const data = await response.json();
      return { details: data };
    } catch (error) {
      console.error("Error getting the details of the movie:", error);
      throw new Error("Error getting the details of the movie.");
    }
  }

  async getMovieStreamings(
    id: string
  ): Promise<{ streamings: ItemWatchProviders }> {
    try {
      const response = await fetchItemApi({
        endpoint: `/movie/${id}/watch/providers`,
      });

      const data = await response.json();

      return { streamings: data };
    } catch (error) {
      console.error("Error getting the providers of the movie:", error);
      throw new Error("Error getting the providers of the movie.");
    }
  }

  async getSerieIdByTitle(title: string) {
    console.log("title", title);

    try {
      const response = await fetchItemApi({
        endpoint: `/search/tv?query=${title}&language=pt-br`,
      });

      const data = await response.json();

      return { id: data.results[0].id };
    } catch (error) {
      console.error("Error getting the id of the serie:", error);
      throw new Error("Error getting the id of the serie.");
    }
  }

  async getSerieDetails(id: string): Promise<{ details: SerieDetails }> {
    try {
      const response = await fetchItemApi({
        endpoint: `/tv/${id}?language=pt-br`,
      });

      const data = await response.json();
      return { details: data };
    } catch (error) {
      console.error("Error getting the details of the serie:", error);
      throw new Error("Error getting the details of the serie.");
    }
  }

  async getSerieStreamings(
    id: string
  ): Promise<{ streamings: ItemWatchProviders }> {
    try {
      const response = await fetchItemApi({
        endpoint: `/tv/${id}/watch/providers`,
      });

      const data = await response.json();

      return { streamings: data };
    } catch (error) {
      console.error("Error getting the providers of the serie:", error);
      throw new Error("Error getting the providers of the serie.");
    }
  }
}
