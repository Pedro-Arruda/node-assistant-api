import { CreateTaskNotion } from "./types";

export const createTaskItemProperties = async (data: CreateTaskNotion) => {
  const { content } = data;

  return {
    title: {
      title: [{ text: { content } }],
    },
  };
};
