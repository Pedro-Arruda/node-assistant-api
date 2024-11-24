const notionGenres: { genre: string; notionName: string }[] = [
  { genre: "Documentároo", notionName: "Document-rio" },
  { genre: "Crime", notionName: "Crime" },
  { genre: "Animação", notionName: "Anima-o" },
  { genre: "Romance", notionName: "Romance" },
  { genre: "Drama", notionName: "Drama" },
  { genre: "Aventura", notionName: "Aventura" },
  { genre: "Terror", notionName: "Terror" },
  { genre: "Guerra", notionName: "Guerra" },
  { genre: "Ação", notionName: "A-o" },
  { genre: "Mistério", notionName: "Mist-rio" },
  { genre: "História", notionName: "Hist-ria" },
  { genre: "Faroeste", notionName: "Faroeste" },
  { genre: "Thriller", notionName: "Thriller" },
  { genre: "Ficção científica", notionName: "Fic-o-cient-fica" },
  { genre: "Comédia", notionName: "Com-dia" },
  { genre: "Fantasia", notionName: "Fantasia" },
  { genre: "Música", notionName: "M-sica" },
];

export const formatNotionGenre = (genre: string): string | undefined => {
  const regex = /\d.*/;

  const formattedGenre = genre
    .replace("https://www.notion.so/", "")
    .replace(regex, "")
    .slice(0, -1);

  const found = notionGenres.find((item) => item.notionName === formattedGenre);
  return found?.genre;
};
