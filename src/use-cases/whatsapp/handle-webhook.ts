import { User } from "@prisma/client";
import { WhatsappService } from "../../lib/whatsapp";
import { UserMessagesRepository } from "../../repositories/messages";
import { UserRepository } from "../../repositories/user";
import { AddSerieToNotionUseCase } from "../series/add-serie-to-notion";
import { AddMovieToNotionUseCase } from "../movies/add-movie-to-notion";
import { AddTaskToNotionUseCase } from "../tasks/add-task-to-notion";

export class HandleWebhookEventUseCase {
  constructor(
    private whatsappService: WhatsappService,
    private usersRepository: UserRepository,
    private userMessagesRepository: UserMessagesRepository
  ) {}

  async execute(messageBody: any) {
    const message = messageBody.entry[0].changes[0].value.messages[0];
    const sender = messageBody.entry[0].changes[0].value.messages[0].from;

    const user = await this.usersRepository.findByPhone(sender);

    if (!user) {
      throw new Error("User not found.");
    }

    if (this.isInteractiveMessage(message)) {
      await this.handleInteractiveMessage(user, message, sender);
    } else {
      await this.handleTextMessage(user, message, sender);
    }
  }

  private isInteractiveMessage(message: any) {
    return (
      message.type === "interactive" &&
      message.interactive.type === "button_reply"
    );
  }

  private async handleInteractiveMessage(
    user: User,
    message: any,
    sender: string
  ) {
    const userLastMessage = await this.usersRepository.getLastMessage(user.id);
    const buttonId = message.interactive.button_reply.id;

    switch (buttonId) {
      case "serie":
        const addSerieToNotionUseCase = new AddSerieToNotionUseCase();
        await addSerieToNotionUseCase.execute({
          title: userLastMessage.message,
          userId: user.id,
        });
        break;

      case "movie":
        const addMovieToNotionUseCase = new AddMovieToNotionUseCase();
        await addMovieToNotionUseCase.execute({
          title: userLastMessage.message,
          userId: user.id,
        });
        break;

      case "task":
        const addTaskToNotionUseCase = new AddTaskToNotionUseCase();
        await addTaskToNotionUseCase.execute({
          content: userLastMessage.message,
          userId: user.id,
        });
        break;

      default:
        await this.whatsappService.sendMessage(
          sender,
          "Opção não reconhecida."
        );
        return;
    }

    await this.whatsappService.sendMessage(
      sender,
      `Seu item está sendo adicionado.`
    );
    await this.userMessagesRepository.deleteMessage(userLastMessage.id);
  }

  private async handleTextMessage(user: any, message: any, sender: string) {
    const messageText = message.text.body;

    await this.userMessagesRepository.save({
      message: messageText,
      user_id: user.id,
    });

    await this.whatsappService.sendNotionCategoriesButtons(sender);
  }
}
