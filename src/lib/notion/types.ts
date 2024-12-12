export interface CreateWatchListItemNotion {
  title: string;
  image: string;
  duration: string | number;
  vote_average: number;
  streamings: string[];
  genres: { id: string }[];
  synopsis: string;
  release_date: string;
  categorie: string;
}

export interface CreateTaskNotion {
  content: string;
}

export interface CreateAppointmentNotion {
  title: string;
}

export interface GetNotionAccessToken {
  access_token: string;
  owner: {
    user: {
      person: {
        email: string;
      };
      name: string;
    };
  };
}
