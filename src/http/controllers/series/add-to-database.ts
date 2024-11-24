import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AddWatchListItemUseCase } from "../../../use-cases/add-watch-list-item-to-notion";
import { MovieApiDatabaseService } from "../../../lib/the-movie-database-service";
import { GetSerieInfoUseCase } from "../../../use-cases/get-serie-infos";

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const addSerieBodySchema = z.object({
    title: z.string(),
  });

  const { title } = addSerieBodySchema.parse(req.body);

  console.log("title usecase", title);

  const serieDatabaseService = new MovieApiDatabaseService();
  const getSerieDetailsUseCase = new GetSerieInfoUseCase(serieDatabaseService);

  const serieInfos = await getSerieDetailsUseCase.execute({ title });

  const addWatchListUseCase = new AddWatchListItemUseCase();

  const response = addWatchListUseCase.execute({
    duration: `${serieInfos.details.number_of_seasons} seasons and ${serieInfos.details.number_of_episodes} episodes`,
    image: serieInfos.details.backdrop_path,
    release_date: serieInfos.details.release_date,
    streamings: serieInfos.streamings,
    synopsis: serieInfos.details.overview,
    title: serieInfos.details.original_name,
    vote_average: serieInfos.details.vote_average,
    genres: serieInfos.genres,
    categorie: "146675fb5be0813ea6b5cec8eae61e2b",
  });

  reply.status(201).send(response);
};
