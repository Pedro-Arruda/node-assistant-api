import { MovieApiDatabaseService } from "../../lib/the-movie-database-service";
import { convertMinutesToTimeString } from "../../utils/convertMinutesToTimeString";
import { AddWatchListItemUseCase } from "../notion/add-watch-list-item-to-notion";
import {
  mapGenresToNotion,
  findCategoryByName,
} from "../notion/notion-utils";
import { UserService } from "../../services/user-service";
import { GetMovieInfoUseCase } from "./get-movie-infos";

export class AddMovieToNotionUseCase {
  constructor(
    private movieDatabaseService: MovieApiDatabaseService = new MovieApiDatabaseService(),
    private userService: UserService = new UserService()
  ) {}

  async execute({ title, userId }: { title: string; userId: string }) {
    const movieInfos = await this.getMovieInfos(title);

    const userNotionData = await this.userService.getUserNotionData(userId);

    const genres = await mapGenresToNotion(movieInfos.genres, userNotionData);

    const foundMovieCategory = await findCategoryByName(
      "Filmes",
      userNotionData
    );

    return await this.addToWatchlist({
      movieInfos,
      userNotionData,
      genres,
      categoryId: foundMovieCategory.id,
    });
  }

  private async getMovieInfos(title: string) {
    const getMovieDetailsUseCase = new GetMovieInfoUseCase(this.movieDatabaseService);
    return await getMovieDetailsUseCase.execute({ title });
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
