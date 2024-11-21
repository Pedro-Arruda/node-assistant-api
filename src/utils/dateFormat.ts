export const dateFormat = (value: string | null | undefined) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
      }).format(new Date(value))
    : "";
