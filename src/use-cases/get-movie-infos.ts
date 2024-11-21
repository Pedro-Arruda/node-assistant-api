import { MovieApiDatabaseService } from "../lib/the-movie-database-service";
import { MovieDetails } from "../lib/the-movie-database-service/types";

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

    const baseImageURL = "https://image.tmdb.org/t/p/w500";
    details.backdrop_path = `${baseImageURL}${details.backdrop_path}`;

    let streamingsNames: string[] = [];

    if (streamings.results.BR) {
      const brazilianStreamings = streamings.results.BR;

      if (brazilianStreamings.buy) {
        brazilianStreamings.buy.map(({ provider_name }) =>
          streamingsNames.push(provider_name)
        );
      }

      if (brazilianStreamings.flatrate) {
        brazilianStreamings.flatrate.map(({ provider_name }) =>
          streamingsNames.push(provider_name)
        );
      }

      if (brazilianStreamings.rent) {
        brazilianStreamings.rent.map(({ provider_name }) =>
          streamingsNames.push(provider_name)
        );
      }
    }

    const genres = details.genres.map((genre) => genre.name);

    return { details, streamings: streamingsNames, genres };
  }
}
