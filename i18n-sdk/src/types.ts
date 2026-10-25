import type { App, Ref } from 'vue'
import type { I18n } from 'vue-i18n'

export interface LanguagePack {
  code: string
  version?: string
  data: Record<string, any>
}

export interface LanguageItem {
  code: string
  name: string
  version?: string
  icon?: string
}

export interface MicroI18nOptions {
  apiUrl?: string
  defaultLang?: string
  fallbackLang?: string
  onLangChange?: (lang: string) => void
}

export interface MicroI18nInstance {
  currentLang: Ref<string>
  currentPack: Ref<Record<string, any>>
  loading: Ref<boolean>
  availableLanguages: Ref<LanguageItem[]>
  vueI18n: I18n<any, any, any, any, false>
  setLang: (lang: string) => Promise<void>
  t: (key: string, ...args: any[]) => string
  install: (app: App) => void
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $microI18n: MicroI18nInstance
  }
}
