import type { LanguageItem, LanguagePack } from './types'

export async function fetchLanguagePack(apiUrl: string, lang: string): Promise<LanguagePack> {
  const url = `${apiUrl.replace(/\/$/, '')}/api/i18n/pack?lang=${encodeURIComponent(lang)}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`[i18n-sdk] 获取语言包失败 HTTP ${res.status}: ${url}`)
  }
  const json = await res.json()
  return json
}

export async function fetchLanguages(apiUrl: string): Promise<LanguageItem[]> {
  try {
    const url = `${apiUrl.replace(/\/$/, '')}/api/i18n/languages`
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.warn('[i18n-sdk] 获取语言列表失败:', error)
    return [
      { code: 'zh-CN', name: '简体中文', icon: '🇨🇳' },
      { code: 'en-US', name: 'English', icon: '🇺🇸' },
    ]
  }
}
