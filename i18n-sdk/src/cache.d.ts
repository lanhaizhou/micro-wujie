import type { LanguagePack } from './types';
export declare function getCachedPack(lang: string): Promise<LanguagePack | null>;
export declare function setCachedPack(lang: string, pack: LanguagePack): Promise<void>;
export declare function clearAllCachedPacks(): Promise<void>;
