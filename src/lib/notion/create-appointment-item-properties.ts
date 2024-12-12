import { CreateAppointmentNotion, CreateTaskNotion } from "./types";

export const createAppointmentItemProperties = async (
  data: CreateAppointmentNotion
) => {
  const { title } = data;

  return {
    title: {
      title: [{ text: { title } }],
    },
  };
};
