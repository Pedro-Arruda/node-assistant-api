import { makeButtonTemplate } from "../../http/controllers/webhook/utils";

export class WhatsappService {
  private accessToken: string;

  constructor({ accessToken }: { accessToken: string }) {
    this.accessToken = accessToken;
  }

  async sendNotionCategoriesButton(to: string) {
    const url = `https://graph.facebook.com/v21.0/485600487973744/messages`;
    const messageTemplate = makeButtonTemplate(to);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageTemplate),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar template de button");
    }

    const data = await response.json();

    return data;
  }

  async sendMessage(to: number, message: string) {
    const url = `https://graph.facebook.com/v21.0/485600487973744/messages`;

    const messageData = {
      messaging_product: "whatsapp",
      to,
      text: { body: message },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar template de button");
    }

    const data = await response.json();

    return data;
  }
}
