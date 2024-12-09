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
        Authorization: `Bearer EAAIeVdZAIBC4BOZBYyFgkzWMj861ZCgAKAzGlqkg15EV4NjuKwX8SKFQVMJVVZAQwZAUL0kC8k2aGkGGmnisBBi5YAC0wMZAvHpAiUHZB4mNgpwut5KZC1xEPiEy88mHW31ZB2E5KAzw91snzxabi3nfkMeEn1ukgUmtDvCRmqif21ckKpuwlZAbVvErjnXXvfXbNGpAZDZD`,
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
}
