export const pageMapping = {
  Home: "/",
  Eventos: "/eventos",
  Programacao: "/programacao",
  Comunidade: "/comunidade",
  Aniversariantes: "/aniversariantes",
  Generosidade: "/generosidade",
  Principios: "/principios",
  Contato: "/contato",
  QuemSomos: "/quem-somos",
  Mais: "/mais",
};

export const createPageUrl = (pageName) => {
  return pageMapping[pageName] || "/";
};

export * from "./date.js";
