import { CreateTaskNotion } from "./types";

export const createTaskItemProperties = (data: CreateTaskNotion) => {
  const { content } = data;

  return {
    title: {
      title: [{ text: { content } }],
    },
  };
};
