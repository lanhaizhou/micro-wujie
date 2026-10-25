import type { LanguageItem, LanguagePack } from './types';
export declare function fetchLanguagePack(apiUrl: string, lang: string): Promise<LanguagePack>;
export declare function fetchLanguages(apiUrl: string): Promise<LanguageItem[]>;
