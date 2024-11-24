import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { GetMovieInfoUseCase } from "../../../use-cases/get-movie-infos";
import { MovieApiDatabaseService } from "../../../lib/the-movie-database-service";
import { AddWatchListItemUseCase } from "../../../use-cases/add-watch-list-item-to-notion";

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const addMovieBodySchema = z.object({
    title: z.string(),
  });

  const { title } = addMovieBodySchema.parse(req.body);

  const movieDatabaseService = new MovieApiDatabaseService();
  const getMovieDetailsUseCase = new GetMovieInfoUseCase(movieDatabaseService);

  const movieInfos = await getMovieDetailsUseCase.execute({ title });

  const addWatchListUseCase = new AddWatchListItemUseCase();

  const response = addWatchListUseCase.execute({
    duration: movieInfos.details.runtime,
    image: movieInfos.details.backdrop_path,
    release_date: movieInfos.details.release_date,
    streamings: movieInfos.streamings,
    synopsis: movieInfos.details.overview,
    title: movieInfos.details.title,
    vote_average: movieInfos.details.vote_average,
    genres: movieInfos.genres,
    categorie: "141675fb5be081b2b112db881e316e29",
  });

  reply.status(201).send(response);
};
