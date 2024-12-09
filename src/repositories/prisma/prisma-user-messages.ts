import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { UserMessagesRepository } from "../messages";

export class PrismaUsersMessageRepository implements UserMessagesRepository {
  async save(data: Prisma.UserMessagesUncheckedCreateInput) {
    const message = await prisma.userMessages.create({ data });

    return message;
  }

  async deleteMessage(messageId: string) {
    await prisma.userMessages.delete({ where: { id: messageId } });
  }
}
