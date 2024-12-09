import { Prisma, UserMessages } from "@prisma/client";

export interface UserMessagesRepository {
  save(data: Prisma.UserMessagesUncheckedCreateInput): Promise<UserMessages>;
  deleteMessage(messageId: string): Promise<void>;
}
