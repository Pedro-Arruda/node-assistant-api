import { Client } from "@notionhq/client";
import { createWatchListItemProperties } from "./create-watch-list-item-properties";
import { env } from "../../env";

export class NotionService {
  private notion: Client;
  private accessToken: string;

  constructor({ accessToken }: { accessToken: string }) {
    this.accessToken = accessToken;
    this.notion = new Client({
      auth: this.accessToken,
    });
  }

  async createWatchListPage(data: CreateWatchListItemNotion) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: "148675fb5be081ebb7f0ccf02487aa75" },
        cover: {
          external: { url: data.image },
        },
        properties: await createWatchListItemProperties(data),
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao salvar dados no Notion");
    }
  }

  async getAccessToken({ code }: GetNotionAccessToken) {
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

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao salvar dados no Notion");
    }
  }

  async getUserDatabasesId() {
    try {
      const response = await this.notion.search({
        filter: { value: "database", property: "object" },
        query: "Watchlist",
      });

      const databases = response.results.map((database: any) => ({
        title: database.title[0].plain_text
          .replace("Watchlist - ", "")
          .toLowerCase(),
        id: database.id,
      }));

      return {
        databases,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao salvar dados no Notion");
    }
  }

  async getDatabasesPages(databaseId: string) {
    const response = await this.notion.databases.query({
      database_id: databaseId,
    });

    return response;
  }
}

export interface CreateWatchListItemNotion {
  title: string;
  image: string;
  duration: string | number;
  vote_average: number;
  streamings: string[];
  genres: { id: string }[];
  synopsis: string;
  release_date: string;
  categorie: string;
}

export interface GetNotionAccessToken {
  code: string;
}