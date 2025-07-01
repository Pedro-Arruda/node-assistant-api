export const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

import { ItemWatchProviders } from "../lib/the-movie-database-service/types";

export function prependImageBaseUrl(path: string): string {
  return `${BASE_IMAGE_URL}${path}`;
}

export function extractStreamingNames(streamings: ItemWatchProviders): string[] {
  const names: string[] = [];
  const providers = streamings.results.BR;
  if (!providers) {
    return names;
  }

  if (providers.buy) {
    providers.buy.forEach(({ provider_name }) => names.push(provider_name));
  }

  if (providers.flatrate) {
    providers.flatrate.forEach(({ provider_name }) => names.push(provider_name));
  }

  if (providers.rent) {
    providers.rent.forEach(({ provider_name }) => names.push(provider_name));
  }

  return names;
}
