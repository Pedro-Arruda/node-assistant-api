import { NotionDatabase, Prisma, User } from "@prisma/client";

export interface UserRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  getDatabases(userId: string): Promise<NotionDatabase[]>;
}
