import { createStore, get, set, clear } from 'idb-keyval';
// 创建独立的 IndexedDB 数据库和对象存储
// Database: micro_i18n_db, Store: lang_packs
const customStore = typeof window !== 'undefined'
    ? createStore('micro_i18n_db', 'lang_packs')
    : null;
const KEY_PREFIX = 'i18n_pack_';
export async function getCachedPack(lang) {
    if (!customStore)
        return null;
    try {
        const data = await get(`${KEY_PREFIX}${lang}`, customStore);
        return data || null;
    }
    catch (error) {
        console.warn(`[i18n-sdk] IndexedDB 读取失败:`, error);
        return null;
    }
}
export async function setCachedPack(lang, pack) {
    if (!customStore)
        return;
    try {
        await set(`${KEY_PREFIX}${lang}`, pack, customStore);
    }
    catch (error) {
        console.warn(`[i18n-sdk] IndexedDB 写入失败:`, error);
    }
}
export async function clearAllCachedPacks() {
    if (!customStore)
        return;
    try {
        await clear(customStore);
    }
    catch (error) {
        console.warn(`[i18n-sdk] IndexedDB 清除失败:`, error);
    }
}
