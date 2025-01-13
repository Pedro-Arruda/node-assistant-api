import { MovieApiDatabaseService } from "../../lib/the-movie-database-service";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-user";
import { convertMinutesToTimeString } from "../../utils/convertMinutesToTimeString";
import { AddWatchListItemUseCase } from "../notion/add-watch-list-item-to-notion";
import { MapGenreUseCase } from "../notion/map-genres";
import { GetCategoryIdUseCase } from "../user/get-category-id";
import { GetUserDataUseCase } from "../user/get-user-data";
import { GetMovieInfoUseCase } from "./get-movie-infos";

export class AddMovieToNotionUseCase {
  async execute({ title, userId }: { title: string; userId: string }) {
    const movieInfos = await this.getMovieInfos(title);

    const userNotionData = await this.getUserNotionData(userId);

    const genres = await this.getGenresMappedToNotion(
      movieInfos.genres,
      userNotionData
    );

    const foundMovieCategory = await this.getMovieCategory(userNotionData);

    return await this.addToWatchlist({
      movieInfos,
      userNotionData,
      genres,
      categoryId: foundMovieCategory.id,
    });
  }

  private async getMovieInfos(title: string) {
    const movieApiService = new MovieApiDatabaseService();
    const getMovieDetailsUseCase = new GetMovieInfoUseCase(movieApiService);
    return await getMovieDetailsUseCase.execute({ title });
  }

  private async getUserNotionData(userId: string) {
    const usersRepository = new PrismaUsersRepository();
    const getUserNotionData = new GetUserDataUseCase(usersRepository);
    return await getUserNotionData.execute(userId);
  }

  private async getGenresMappedToNotion(genres: string[], userNotionData: any) {
    const getGenreDatabaseIdUseCase = new MapGenreUseCase({
      genresDatabaseId: userNotionData.genreDatabase.notion_id,
    });
    const notionGenres = await getGenreDatabaseIdUseCase.execute(
      userNotionData.accessToken
    );

    return genres
      .map((genre) => ({ id: notionGenres[genre] }))
      .filter((genre) => genre.id);
  }

  private async getMovieCategory(userNotionData: any) {
    const getCategoryIdUseCase = new GetCategoryIdUseCase({
      categoryDatabaseId: userNotionData.categoryDatabase.notion_id,
    });
    const notionCategoriesId = await getCategoryIdUseCase.execute(
      userNotionData.accessToken
    );

    const foundMovie = notionCategoriesId.find(
      (page: any) => page.properties.Name.title[0]?.plain_text === "Filmes"
    );

    if (!foundMovie) throw new Error("Movies database not found.");
    return foundMovie;
  }

  private async addToWatchlist({
    movieInfos,
    userNotionData,
    genres,
    categoryId,
  }: {
    movieInfos: any;
    userNotionData: any;
    genres: any[];
    categoryId: string;
  }) {
    const addWatchListUseCase = new AddWatchListItemUseCase();

    return await addWatchListUseCase.execute({
      data: {
        duration: convertMinutesToTimeString(movieInfos.details.runtime),
        image: movieInfos.details.backdrop_path,
        release_date: movieInfos.details.release_date,
        streamings: movieInfos.streamings,
        synopsis: movieInfos.details.overview,
        title: movieInfos.details.original_title,
        vote_average: movieInfos.details.vote_average,
        genres,
        categorie: categoryId,
      },
      accessToken: userNotionData.accessToken,
      databaseId: userNotionData.contentsDatabase.notion_id,
    });
  }
}
