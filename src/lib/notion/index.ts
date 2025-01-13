import { Client } from "@notionhq/client";
import { createWatchListItemProperties } from "./create-watch-list-item-properties";
import { env } from "../../env";
import {
  CreateAppointmentNotion,
  CreateBookNotion,
  CreateTaskNotion,
  CreateWatchListItemNotion,
  GetNotionAccessToken,
} from "./types";
import { CreatePageResponse } from "@notionhq/client/build/src/api-endpoints";
import { retry } from "../../utils/retry";
import { createTaskItemProperties } from "./create-task-item-properties";
import { createAppointmentItemProperties } from "./create-appointment-item-properties";
import { createBookItemProperties } from "./create-book-list-item-properties";

export class NotionService {
  private notion: Client;
  private accessToken: string;

  constructor({ accessToken }: { accessToken: string }) {
    this.accessToken = accessToken;
    this.notion = new Client({
      auth: this.accessToken,
    });
  }

  async createWatchListPage(
    watchlistItem: CreateWatchListItemNotion,
    databaseId: string
  ) {
    await this.createPage(
      watchlistItem,
      databaseId,
      createWatchListItemProperties,
      watchlistItem.image
    );
  }

  async createBookListPage(item: CreateBookNotion, databaseId: string) {
    await this.createPage(
      item,
      databaseId,
      createBookItemProperties,
      item.cover
    );
  }

  async createTaskPage(task: CreateTaskNotion, databaseId: string) {
    await this.createPage(task, databaseId, createTaskItemProperties);
  }

  async createAppointmentPage(
    appointment: CreateAppointmentNotion,
    databaseId: string
  ) {
    await this.createPage(
      appointment,
      databaseId,
      createAppointmentItemProperties
    );
  }

  async createPage<T>(
    item: T,
    databaseId: string,
    createPropertiesFn: (item: T) => any,
    coverUrl?: string
  ): Promise<CreatePageResponse> {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: databaseId },
        ...(coverUrl ? { cover: { external: { url: coverUrl } } } : {}),
        properties: await createPropertiesFn(item),
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao salvar dados no Notion");
    }
  }

  async getAccessToken(code: string): Promise<GetNotionAccessToken> {
    try {
      const response = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          redirect_uri: `https://notion-assistant-api.vercel.app/notion/auth/callback`,
          // redirect_uri: `https://localhost:3333`,
        }),
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
          Authorization: `Basic ${Buffer.from(
            `${env.NOTION_CLIENT_ID}:${env.NOTION_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      });

      const data: GetNotionAccessToken = await response.json();
      if (!response.ok) {
        console.error(data);
        throw new Error("Erro ao pegar access token do Notion");
      }

      return data;
    } catch (error) {
      throw new Error("Erro ao pegar access token do Notion");
    }
  }

  async getNotionDatabases(): Promise<{
    databases: { type: string; id: string }[];
  }> {
    return await retry(
      async () => {
        const response = await this.notion.search({
          filter: { value: "database", property: "object" },
          query: "Assistant - ",
        });

        if (!response.results || response.results.length === 0) {
          throw new Error("Databases not found yet");
        }

        const databases = response.results.map((database: any) => {
          const type = database.title[0].plain_text
            .replace("Assistant - ", "")
            .toLowerCase();

          return {
            type,
            id: database.id,
          };
        });

        return { databases };
      },
      3,
      3000
    );
  }

  async getDatabasePages(databaseId: string) {
    const response = await this.notion.databases.query({
      database_id: databaseId,
    });

    return response;
  }
}
