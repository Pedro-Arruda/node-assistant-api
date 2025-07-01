import { MapGenreUseCase } from "./map-genres";
import { GetCategoryIdUseCase } from "../user/get-category-id";

export async function mapGenresToNotion(
  genres: string[],
  userNotionData: any,
) {
  const getGenreDatabaseIdUseCase = new MapGenreUseCase({
    genresDatabaseId: userNotionData.genreDatabase.notion_id,
  });
  const notionGenres = await getGenreDatabaseIdUseCase.execute(
    userNotionData.accessToken,
  );

  return genres
    .map((genre) => ({ id: notionGenres[genre] }))
    .filter((genre) => genre.id);
}

export async function findCategoryByName(
  categoryName: string,
  userNotionData: any,
) {
  const getCategoryIdUseCase = new GetCategoryIdUseCase({
    categoryDatabaseId: userNotionData.categoryDatabase.notion_id,
  });
  const notionCategoriesId = await getCategoryIdUseCase.execute(
    userNotionData.accessToken,
  );

  const found = notionCategoriesId.find(
    (page: any) => page.properties.Name.title[0]?.plain_text === categoryName,
  );

  if (!found) {
    throw new Error(`${categoryName} database not found.`);
  }

  return found;
}
