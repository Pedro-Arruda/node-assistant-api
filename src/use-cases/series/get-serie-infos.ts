import { MovieApiDatabaseService } from "../../lib/the-movie-database-service";
import { SerieDetails } from "../../lib/the-movie-database-service/types";
import {
  extractStreamingNames,
  prependImageBaseUrl,
} from "../../utils/tmdb";

interface GetSerieInfoUseCaseRequest {
  title: string;
}

interface GetSerieInfoUseCaseResponse {
  details: SerieDetails;
  streamings: string[];
  genres: string[];
}

export class GetSerieInfoUseCase {
  constructor(private serieDatabaseService: MovieApiDatabaseService) {}

  async execute({
    title,
  }: GetSerieInfoUseCaseRequest): Promise<GetSerieInfoUseCaseResponse> {
    const { id } = await this.serieDatabaseService.getSerieIdByTitle(title);

    const { details } = await this.serieDatabaseService.getSerieDetails(id);

    const { streamings } = await this.serieDatabaseService.getSerieStreamings(
      id
    );

    details.backdrop_path = prependImageBaseUrl(details.backdrop_path);

    const streamingsNames = extractStreamingNames(streamings);

    const genres = details.genres.map((genre) => genre.name);

    return { details, streamings: streamingsNames, genres };
  }
}
