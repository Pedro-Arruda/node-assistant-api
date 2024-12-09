import { WhatsappService } from "../../lib/whatsapp";
import { UserMessagesRepository } from "../../repositories/messages";
import { UserRepository } from "../../repositories/user";
import { AddSerieToNotionUseCase } from "../series/add-serie-to-notion";

export class HandleWebhookEventUseCase {
  constructor(
    private whatsappService: WhatsappService,
    private usersRepository: UserRepository,
    private userMessagesRepository: UserMessagesRepository
  ) {}

  async execute(messageBody: any) {
    console.log(messageBody);

    const message = messageBody.entry[0].changes[0].value.messages[0];
    const sender = messageBody.entry[0].changes[0].value.messages[0].from;

    const user = await this.usersRepository.findByPhone(sender);

    if (!user) {
      throw new Error("User not found.");
    }

    const isInteractiveMessage =
      message.type === "interactive" &&
      message.interactive.type === "button_reply";

    if (isInteractiveMessage) {
      const userLastMessage = await this.usersRepository.getLastMessage(
        user.id
      );

      const buttonId = message.interactive.button_reply.id;

      if (buttonId === "serie") {
        const addSerieToNotionUseCase = new AddSerieToNotionUseCase();

        await addSerieToNotionUseCase.execute({
          title: userLastMessage.message,
          userId: user.id,
        });
      }

      await this.whatsappService.sendMessage(
        sender,
        `Seu item está sendo adicionado.`
      );

      await this.userMessagesRepository.deleteMessage(userLastMessage.id);
    } else {
      const messageText = message.text.body;

      await this.userMessagesRepository.save({
        message: messageText,
        user_id: user.id,
      });

      await this.whatsappService.sendNotionCategoriesButtons(sender);
    }
  }
}
