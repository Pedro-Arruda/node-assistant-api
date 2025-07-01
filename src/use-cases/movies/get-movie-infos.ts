import { MovieApiDatabaseService } from "../../lib/the-movie-database-service";
import { MovieDetails } from "../../lib/the-movie-database-service/types";
import {
  extractStreamingNames,
  prependImageBaseUrl,
} from "../../utils/tmdb";

interface GetMovieInfoUseCaseRequest {
  title: string;
}

interface GetMovieInfoUseCaseResponse {
  details: MovieDetails;
  streamings: string[];
  genres: string[];
}

export class GetMovieInfoUseCase {
  constructor(private movieDatabaseService: MovieApiDatabaseService) {}

  async execute({
    title,
  }: GetMovieInfoUseCaseRequest): Promise<GetMovieInfoUseCaseResponse> {
    const { id } = await this.movieDatabaseService.getMovieIdByTitle(title);

    const { details } = await this.movieDatabaseService.getMovieDetails(id);

    const { streamings } = await this.movieDatabaseService.getMovieStreamings(
      id
    );

    details.backdrop_path = prependImageBaseUrl(details.backdrop_path);

    const streamingsNames = extractStreamingNames(streamings);

    const genres = details.genres.map((genre) => genre.name);

    return { details, streamings: streamingsNames, genres };
  }
}
