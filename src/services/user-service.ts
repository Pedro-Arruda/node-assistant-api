import { PrismaUsersRepository } from "../repositories/prisma/prisma-user";
import { GetUserDataUseCase } from "../use-cases/user/get-user-data";

export class UserService {
  private usersRepository = new PrismaUsersRepository();
  private getUserDataUseCase = new GetUserDataUseCase(this.usersRepository);

  async getUserNotionData(userId: string) {
    return this.getUserDataUseCase.execute(userId);
  }
}
