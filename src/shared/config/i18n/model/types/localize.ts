export enum LanguageList {
  EN = 'en',
  RU = 'ru',
}

export type LanguageType = Lowercase<keyof typeof LanguageList>;
