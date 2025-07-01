import { env } from "../../env";
import { ArtistInfo, ISpotifyService } from "./types";

export class SpotifyService implements ISpotifyService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor(
    clientId: string = env.SPOTIFY_CLIENT_ID ?? "",
    clientSecret: string = env.SPOTIFY_CLIENT_SECRET ?? ""
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async authenticate() {
    if (this.accessToken) return;

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error getting Spotify access token");
    }

    this.accessToken = data.access_token;
  }

  async getArtistInfo(name: string): Promise<{ data: ArtistInfo }> {
    await this.authenticate();
    const query = encodeURIComponent(name);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    const data = await response.json();
    if (!response.ok || !data.artists.items.length) {
      throw new Error("Artist not found");
    }
    const artist = data.artists.items[0];
    const info: ArtistInfo = {
      name: artist.name,
      genres: artist.genres,
      followers: artist.followers.total,
      image: artist.images?.[0]?.url || "",
      url: artist.external_urls.spotify,
    };
    return { data: info };
  }
}
