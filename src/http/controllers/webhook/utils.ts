export const makeListTemplate = (to: string) => {
  return {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "O que você deseja adicionar ao Notion?",
      },
      body: {
        text: "Selecione uma das opções abaixo:",
      },
      footer: {
        text: "Escolha uma das categorias.",
      },
      action: {
        button: "Opções",
        sections: [
          {
            title: "Categorias",
            rows: [
              {
                id: "serie",
                title: "Série",
                description: "Adicionar uma nova série.",
              },
              {
                id: "movie",
                title: "Filme",
                description: "Adicionar um novo filme.",
              },
              {
                id: "task",
                title: "Lembrete",
                description: "Adicionar um lembrete ou tarefa.",
              },
              {
                id: "appointment",
                title: "Compromisso",
                description: "Adicionar um compromisso ou evento.",
              },
            ],
          },
        ],
      },
    },
  };
};
