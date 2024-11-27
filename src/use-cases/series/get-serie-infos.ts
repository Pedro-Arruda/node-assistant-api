import { MovieApiDatabaseService } from "../../lib/the-movie-database-service";
import { SerieDetails } from "../../lib/the-movie-database-service/types";

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
