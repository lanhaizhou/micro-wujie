import { type Plugin } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MicroI18nInstance, MicroI18nOptions } from './types';
export * from './types';
export * from './cache';
export * from './api';
export { useI18n };
export declare function createMicroI18n(options?: MicroI18nOptions): Plugin & MicroI18nInstance;
/**
 * Composition API Hook
 */
export declare function useMicroI18n(): MicroI18nInstance;
