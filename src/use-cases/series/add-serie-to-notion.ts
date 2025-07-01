import { MovieApiDatabaseService } from "../../lib/the-movie-database-service";
import { SerieDetails } from "../../lib/the-movie-database-service/types";
import { GetSerieInfoUseCase } from "./get-serie-infos";
import { UserService } from "../../services/user-service";
import { AddWatchListItemUseCase } from "../notion/add-watch-list-item-to-notion";
import {
  mapGenresToNotion,
  findCategoryByName,
} from "../notion/notion-utils";

export class AddSerieToNotionUseCase {
  constructor(
    private movieDatabaseService: MovieApiDatabaseService = new MovieApiDatabaseService(),
    private userService: UserService = new UserService()
  ) {}

  async execute({ title, userId }: { title: string; userId: string }) {
    const serieInfos = await this.getSerieInfos(title);

    const userNotionData = await this.userService.getUserNotionData(userId);

    const genres = await mapGenresToNotion(serieInfos.genres, userNotionData);

    const foundSerieCategory = await findCategoryByName(
      "Series",
      userNotionData
    );

    return this.addToWatchlist({
      serieInfos,
      userNotionData,
      genres,
      categoryId: foundSerieCategory.id,
    });
  }

  private async getSerieInfos(title: string) {
    const getSerieDetailsUseCase = new GetSerieInfoUseCase(this.movieDatabaseService);
    return await getSerieDetailsUseCase.execute({ title });
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
