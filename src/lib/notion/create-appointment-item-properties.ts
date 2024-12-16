import { CreateAppointmentNotion } from "./types";

export const createAppointmentItemProperties = async (
  data: CreateAppointmentNotion
) => {
  const { title } = data;

  return {
    title: [
      {
        text: {
          content: title,
        },
      },
    ],
    Date: {
      start: new Date().toISOString().slice(0, 10),
    },
  };
};
