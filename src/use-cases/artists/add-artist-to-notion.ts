import { SpotifyService } from "../../lib/spotify";
import { AddArtistItemUseCase } from "../notion/add-artist-item-to-notion";
import { UserService } from "../../services/user-service";
import { GetArtistInfoUseCase } from "./get-artist-info";

export class AddArtistToNotionUseCase {
  constructor(
    private userService: UserService = new UserService(),
    private spotifyService: SpotifyService = new SpotifyService()
  ) {}

  async execute({ name, userId }: { name: string; userId: string }) {
    const { details } = await this.getArtistInfo(name);

    const userNotionData = await this.userService.getUserNotionData(userId);

    return await this.addToArtistDatabase({
      artistInfos: details,
      userNotionData,
    });
  }

  private async getArtistInfo(name: string) {
    const useCase = new GetArtistInfoUseCase(this.spotifyService);
    return await useCase.execute({ name });
  }

  private async addToArtistDatabase({
    artistInfos,
    userNotionData,
  }: {
    artistInfos: any;
    userNotionData: any;
  }) {
    const addArtistItemUseCase = new AddArtistItemUseCase();
    return await addArtistItemUseCase.execute({
      data: artistInfos,
      accessToken: userNotionData.accessToken,
      databaseId: userNotionData.artistsDatabase.notion_id,
    });
  }
}
