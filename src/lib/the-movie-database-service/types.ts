export interface IMovieDatabaseService {
  getMovieIdByTitle(title: string): Promise<{ id: string }>;
  getMovieDetails(title: string): Promise<{ details: MovieDetails }>;
}

export interface MovieDetails {
  id: number;
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  original_title: string;
  overview: string;
  release_date: string;
  runtime: number;
  title: string;
  vote_average: number;
}

export interface SerieDetails {
  id: number;
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  original_name: string;
  overview: string;
  release_date: string;
  runtime: number;
  name: string;
  vote_average: number;
  number_of_episodes: number;
  number_of_seasons: number;
}

export interface ItemWatchProviders {
  results: {
    BR?: {
      flatrate?: {
        provider_name: string;
      }[];
      buy?: {
        provider_name: string;
      }[];
      rent?: {
        provider_name: string;
      }[];
    };
  };
}
