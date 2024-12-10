import { UserRepository } from "../../repositories/user";

export class GetUserDataUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.usersRepository.findById(userId);
    const userDatabases = await this.usersRepository.getDatabases(userId);

    if (!user || !user.notion_access_token) {
      throw new Error("Dados do usuário não encontrados");
    }

    const genreDatabase = userDatabases.find((db) => db.type === "genres");

    const categoryDatabase = userDatabases.find(
      (db) => db.type === "categories"
    );

    const contentsDatabase = userDatabases.find((db) => db.type === "contents");
    const tasksDatabase = userDatabases.find((db) => db.type === "tasks");

    if (
      !genreDatabase ||
      !categoryDatabase ||
      !contentsDatabase ||
      !tasksDatabase
    ) {
      throw new Error("Databases não encontrados");
    }

    return {
      genreDatabase,
      categoryDatabase,
      contentsDatabase,
      tasksDatabase,
      accessToken: user.notion_access_token,
    };
  }
}
