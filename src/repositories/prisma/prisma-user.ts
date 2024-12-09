import { NotionDatabase, Prisma, UserMessages } from "@prisma/client";
import { UserRepository } from "../user";
import { prisma } from "../../lib/prisma";

export class PrismaUsersRepository implements UserRepository {
  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = await prisma.user.create({ data });

    return user;
  }

  async findById(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return user;
  }

  async findByPhone(phone: string) {
    const user = await prisma.user.findFirst({ where: { phone } });

    return user;
  }

  async getDatabases(userId: string) {
    const databases = await prisma.notionDatabase.findMany({
      where: { user_id: userId },
    });

    return databases;
  }

  async getLastMessage(userId: string) {
    const message = await prisma.userMessages.findFirstOrThrow({
      where: { user_id: userId },
      orderBy: {
        created_at: "desc",
      },
    });

    return message;
  }

  async deleteMessage(messageId: string) {
    await prisma.userMessages.delete({ where: { id: messageId } });
  }
}
