import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { AddWatchListItemUseCase } from "../../../use-cases/add-watch-list-item-to-notion";
import { MovieApiDatabaseService } from "../../../lib/the-movie-database-service";
import { GetSerieInfoUseCase } from "../../../use-cases/get-serie-infos";
import { GetUserNotionData } from "../../../use-cases/get-user-notion-data";
import { GetGenreDatabaseIdUseCase } from "../../../use-cases/get-genre-database-id";
import { GetCategoryIdUseCase } from "../../../use-cases/get-category-id";

export const addToDatabase = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const addSerieBodySchema = z.object({
    title: z.string(),
    userId: z.string(),
  });

  const { title, userId } = addSerieBodySchema.parse(req.body);

  const serieDatabaseService = new MovieApiDatabaseService();
  const getSerieDetailsUseCase = new GetSerieInfoUseCase(serieDatabaseService);
  const serieInfos = await getSerieDetailsUseCase.execute({ title });

  const getUserNotionData = new GetUserNotionData();
  const { genreDatabaseId, categoryDatabaseId, notionAccessToken } =
    await getUserNotionData.execute(userId);

  const getGenreDatabaseIdUseCase = new GetGenreDatabaseIdUseCase({
    genresDatabaseId: genreDatabaseId!,
  });
  const notionGenres = await getGenreDatabaseIdUseCase.execute(
    notionAccessToken
  );

  const genres = serieInfos.genres
    .map((genre) => ({
      id: notionGenres[genre],
    }))
    .filter((genre) => genre.id);

  const getCategoryIdUseCase = new GetCategoryIdUseCase({
    categoryDatabaseId: categoryDatabaseId!,
  });
  const categoriesId = await getCategoryIdUseCase.execute(notionAccessToken);
  const seriesId = categoriesId.find(
    (page: any) => page.properties.Name.title[0]?.plain_text === "Series"
  )?.id;

  const addWatchListUseCase = new AddWatchListItemUseCase();
  const response = await addWatchListUseCase.execute({
    data: {
      duration: `${serieInfos.details.number_of_seasons} seasons and ${serieInfos.details.number_of_episodes} episodes`,
      image: serieInfos.details.backdrop_path,
      release_date: serieInfos.details.release_date,
      streamings: serieInfos.streamings,
      synopsis: serieInfos.details.overview,
      title: serieInfos.details.original_name,
      vote_average: serieInfos.details.vote_average,
      genres,
      categorie: seriesId || "",
    },
    accessToken: notionAccessToken,
  });

  reply.status(201).send({ response });
};
