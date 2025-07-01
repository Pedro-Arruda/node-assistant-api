import { SpotifyService } from "../../lib/spotify";
import { ArtistInfo } from "../../lib/spotify/types";

interface GetArtistInfoUseCaseRequest {
  name: string;
}

interface GetArtistInfoUseCaseResponse {
  details: ArtistInfo;
}

export class GetArtistInfoUseCase {
  constructor(private spotifyService: SpotifyService) {}

  async execute({ name }: GetArtistInfoUseCaseRequest): Promise<GetArtistInfoUseCaseResponse> {
    const { data } = await this.spotifyService.getArtistInfo(name);
    return { details: data };
  }
}
