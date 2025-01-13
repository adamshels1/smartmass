export enum LanguageList {
  EN = 'en',
  RU = 'ru',
  TR = 'tr',
  AR = 'ar',
  ES = 'es',
  ZH = 'zh',
  FR = 'fr',
}

export type LanguageType = Lowercase<keyof typeof LanguageList>;
