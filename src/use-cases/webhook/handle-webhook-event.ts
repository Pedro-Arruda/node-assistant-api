import { InjectOptions } from "fastify";
import { app } from "../../app";

export class HandleWebhookEventUseCase {
  async execute(payload: { message: string; userId: string }) {
    const { message, userId } = payload;

    const title = this.extractTitle(message);

    if (!title) {
      throw new Error("Title cannot be empty after removing keywords.");
    }

    const messageType = this.handleMessageType(message);

    const redirect = this.createRedirect(messageType, title, userId);

    if (!redirect) {
      throw new Error(`Unhandled webhook event type: ${messageType}`);
    }

    await app.inject(redirect);
  }

  private handleMessageType(message: string): string {
    const seriesKeywords = ["serie", "series", "série", "séries"];
    const moviesKeywords = ["movie", "movies", "filme", "filmes"];

    const normalizedMessage = message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (seriesKeywords.some((keyword) => normalizedMessage.includes(keyword))) {
      return "series";
    }

    if (moviesKeywords.some((keyword) => normalizedMessage.includes(keyword))) {
      return "movies";
    }

    return "unknown";
  }

  private extractTitle(message: string): string {
    const normalizedMessage = message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const cleanedMessage = normalizedMessage
      .replace(/series|serie|séries|série|movie|movies|filme|filmes/g, "")
      .trim();

    return cleanedMessage;
  }

  private createRedirect(
    messageType: string,
    title: string,
    userId: string
  ): InjectOptions | null {
    switch (messageType) {
      case "series":
        return {
          method: "POST",
          url: "/notion/series/add",
          payload: { title, userId },
        };

      case "movies":
        return {
          method: "POST",
          url: "/notion/movies/add",
          payload: { title, userId },
        };

      default:
        return null;
    }
  }
}
