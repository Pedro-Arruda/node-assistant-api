export interface ISpotifyService {
  getArtistInfo(name: string): Promise<{ data: ArtistInfo }>;
}

export interface ArtistInfo {
  name: string;
  image: string;
  genres: string[];
  followers: number;
  url: string;
}
