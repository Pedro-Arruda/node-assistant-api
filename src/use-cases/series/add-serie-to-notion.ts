import { MovieApiDatabaseService } from "../../lib/the-movie-database-service";
import { SerieDetails } from "../../lib/the-movie-database-service/types";
import { GetCategoryIdUseCase } from "../user/get-category-id";
import { GetSerieInfoUseCase } from "./get-serie-infos";
import { GetUserDataUseCase } from "../user/get-user-data";
import { MapGenreUseCase } from "../notion/map-genres";
import { AddWatchListItemUseCase } from "../notion/add-watch-list-item-to-notion";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-user";

export class AddSerieToNotionUseCase {
  async execute({ title, userId }: { title: string; userId: string }) {
    const serieInfos = await this.getSerieInfos(title);

    const userNotionData = await this.getUserNotionData(userId);

    const genres = await this.getGenresMappedToNotion(
      serieInfos.genres,
      userNotionData
    );

    const foundSerieCategory = await this.getSerieCategory(userNotionData);

    return this.addToWatchlist({
      serieInfos,
      userNotionData,
      genres,
      categoryId: foundSerieCategory.id,
    });
  }

  private async getSerieInfos(title: string) {
    const movieApiService = new MovieApiDatabaseService();
    const getSerieDetailsUseCase = new GetSerieInfoUseCase(movieApiService);
    return await getSerieDetailsUseCase.execute({ title });
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

  private async getSerieCategory(userNotionData: any) {
    const getCategoryIdUseCase = new GetCategoryIdUseCase({
      categoryDatabaseId: userNotionData.categoryDatabase.notion_id,
    });
    const notionCategoriesId = await getCategoryIdUseCase.execute(
      userNotionData.accessToken
    );

    const foundSerie = notionCategoriesId.find(
      (page: any) => page.properties.Name.title[0]?.plain_text === "Series"
    );

    if (!foundSerie) throw new Error("Serie database not found.");
    return foundSerie;
  }

  private async addToWatchlist({
    serieInfos,
    userNotionData,
    genres,
    categoryId,
  }: {
    serieInfos: {
      details: SerieDetails;
      streamings: string[];
      genres: string[];
    };
    userNotionData: any;
    genres: any[];
    categoryId: string;
  }) {
    const addWatchListUseCase = new AddWatchListItemUseCase();
    return await addWatchListUseCase.execute({
      data: {
        duration: `${serieInfos.details.number_of_seasons} temporadas e ${serieInfos.details.number_of_episodes} episódios`,
        image: serieInfos.details.backdrop_path,
        release_date: serieInfos.details.release_date,
        streamings: serieInfos.streamings,
        synopsis: serieInfos.details.overview,
        title: serieInfos.details.original_name,
        vote_average: serieInfos.details.vote_average,
        genres,
        categorie: categoryId,
      },
      accessToken: userNotionData.accessToken,
      databaseId: userNotionData.contentsDatabase.notion_id,
    });
  }
}
