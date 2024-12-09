export const makeButtonTemplate = (to: string) => {
  return {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "O que você deseja adicionar ao Notion?",
      },
      body: {
        text: "Clique em uma das opções abaixo:",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "serie",
              title: "Série",
            },
          },
          {
            type: "reply",
            reply: {
              id: "movie",
              title: "Filme",
            },
          },
          {
            type: "reply",
            reply: {
              id: "task",
              title: "Lembrete",
            },
          },
        ],
      },
    },
  };
};
