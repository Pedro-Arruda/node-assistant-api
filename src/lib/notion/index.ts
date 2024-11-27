import { Client } from "@notionhq/client";
import { createWatchListItemProperties } from "./create-watch-list-item-properties";
import { env } from "../../env";
import { CreateWatchListItemNotion, GetNotionAccessToken } from "./types";
import {
  CreatePageResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

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
    watchListItem: CreateWatchListItemNotion,
    databaseId: string
  ): Promise<CreatePageResponse> {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: databaseId },
        cover: {
          external: { url: watchListItem.image },
        },
        properties: await createWatchListItemProperties(watchListItem),
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

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao pegar access token do Notion");
    }
  }

  async getNotionDatabases(): Promise<{
    databases: { type: string; id: string }[];
  }> {
    try {
      const response = await this.notion.search({
        filter: { value: "database", property: "object" },
        query: "Watchlist - ",
      });

      const databases = response.results.map((database: any) => {
        const type = database.title[0].plain_text
          .replace("Watchlist - ", "")
          .toLowerCase();

        return {
          type,
          id: database.id,
        };
      });

      return {
        databases,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao salvar dados no Notion");
    }
  }

  async getDatabasePages(databaseId: string) {
    const response = await this.notion.databases.query({
      database_id: databaseId,
    });

    return response;
  }
}
