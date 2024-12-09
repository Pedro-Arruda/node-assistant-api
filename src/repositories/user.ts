import { NotionDatabase, Prisma, User, UserMessages } from "@prisma/client";

export interface UserRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  getDatabases(userId: string): Promise<NotionDatabase[]>;
  getLastMessage(userId: string): Promise<UserMessages>;
}
