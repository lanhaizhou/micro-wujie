import { ref, inject } from 'vue';
import { createI18n, useI18n } from 'vue-i18n';
import { getCachedPack, setCachedPack } from './cache';
import { fetchLanguagePack, fetchLanguages } from './api';
export * from './types';
export * from './cache';
export * from './api';
export { useI18n };
const I18N_INJECTION_KEY = Symbol('micro_i18n');
let globalInstance = null;
export function createMicroI18n(options = {}) {
    const apiUrl = options.apiUrl || 'http://localhost:3000';
    const fallbackLang = options.fallbackLang || 'zh-CN';
    // 判断是否处于无界子应用微前端沙箱中
    const isSubApp = typeof window !== 'undefined' && Boolean(window.__POWERED_BY_WUJIE__);
    // 如果处于子应用中，优先读取基座注入的 props.lang
    const initialLang = (isSubApp && window.$wujie?.props?.lang)
        || options.defaultLang
        || 'zh-CN';
    // 初始化官方 vue-i18n 实例 (Composition API 模式, messages 初始为空遵循无本地写死原则)
    const vueI18n = createI18n({
        legacy: false,
        locale: initialLang,
        fallbackLocale: fallbackLang,
        messages: {},
        missingWarn: false,
        fallbackWarn: false,
    });
    const currentLang = ref(initialLang);
    const currentPack = ref({});
    const langTick = ref(0);
    const loading = ref(false);
    const availableLanguages = ref([
        { code: 'zh-CN', name: '简体中文', icon: '🇨🇳' },
        { code: 'en-US', name: 'English', icon: '🇺🇸' },
    ]);
    /**
     * 主基座向所有微前端子应用广播语言包数据
     */
    function broadcastLang(lang, pack, version) {
        if (typeof window !== 'undefined' && !isSubApp) {
            const wujieBus = window.__WUJIE_BUS__ || window.$wujie?.bus;
            if (wujieBus && typeof wujieBus.$emit === 'function') {
                const messagePack = (pack && Object.keys(pack).length > 0) ? pack : vueI18n.global.getLocaleMessage(lang);
                if (messagePack && Object.keys(messagePack).length > 0) {
                    wujieBus.$emit('main:change-lang', {
                        lang,
                        pack: messagePack,
                        version,
                    });
                }
            }
        }
    }
    /**
     * 加载语言包（结合 IndexedDB 缓存与 vue-i18n 动态挂载）
     */
    async function loadLanguage(lang, targetVersion) {
        // 1. 如果 vue-i18n 内部已挂载该语言包且无强制新版本，直接切换
        const existing = vueI18n.global.getLocaleMessage(lang);
        if (existing && Object.keys(existing).length > 0 && !targetVersion) {
            vueI18n.global.locale.value = lang;
            currentLang.value = lang;
            currentPack.value = existing;
            langTick.value++;
            return;
        }
        loading.value = true;
        try {
            // 2. 查询 IndexedDB 缓存
            const cached = await getCachedPack(lang);
            // 命中缓存且版本匹配 -> 直接灌入 vue-i18n，0 次网络请求！
            if (cached && cached.data && (!targetVersion || cached.version === targetVersion)) {
                vueI18n.global.setLocaleMessage(lang, cached.data);
                vueI18n.global.locale.value = lang;
                currentLang.value = lang;
                currentPack.value = cached.data;
                langTick.value++;
                loading.value = false;
                return;
            }
            // 3. 无本地缓存或版本更新 -> 请求后端拉取最新 JSON
            console.log(`[i18n-sdk(vue-i18n)] 拉取语言包 [${lang}] (本地版本: ${cached?.version || '无'} vs 目标: ${targetVersion || '最新'})`);
            const latestPack = await fetchLanguagePack(apiUrl, lang);
            // 4. 灌入官方 vue-i18n 实例并更新 IndexedDB 缓存
            vueI18n.global.setLocaleMessage(lang, latestPack.data || {});
            vueI18n.global.locale.value = lang;
            currentLang.value = lang;
            currentPack.value = latestPack.data || {};
            langTick.value++;
            await setCachedPack(lang, latestPack);
        }
        catch (error) {
            console.error(`[i18n-sdk(vue-i18n)] 加载语言包 [${lang}] 失败:`, error);
        }
        finally {
            loading.value = false;
        }
    }
    /**
     * 切换语言
     */
    async function setLang(lang) {
        const targetItem = availableLanguages.value.find((l) => l.code === lang);
        await loadLanguage(lang, targetItem?.version);
        options.onLangChange?.(lang);
        broadcastLang(lang, currentPack.value, targetItem?.version);
    }
    /**
     * 基于官方 vue-i18n 的翻译方法
     */
    function t(key, ...args) {
        void langTick.value;
        void currentPack.value;
        try {
            return vueI18n.global.t(key, ...args);
        }
        catch {
            return key;
        }
    }
    // ==========================================
    // 初始化策略：区分子应用沙箱与主基座
    // ==========================================
    if (isSubApp) {
        // 【子应用沙箱模式】：直接使用基座透传的语言包 (0 次网络请求)
        const injectedPack = window.$wujie?.props?.langPack;
        if (injectedPack && Object.keys(injectedPack).length > 0) {
            vueI18n.global.setLocaleMessage(initialLang, injectedPack);
            vueI18n.global.locale.value = initialLang;
            currentPack.value = injectedPack;
            langTick.value++;
        }
        // 自动监听基座多语言广播
        const handleMainChangeLang = (payload) => {
            if (!payload)
                return;
            const newLang = typeof payload === 'string' ? payload : payload.lang;
            const newPack = typeof payload === 'object' ? payload.pack : null;
            if (newPack && Object.keys(newPack).length > 0) {
                vueI18n.global.setLocaleMessage(newLang, newPack);
                vueI18n.global.locale.value = newLang;
                currentLang.value = newLang;
                currentPack.value = newPack;
                langTick.value++;
            }
            else {
                loadLanguage(newLang).catch(() => { });
            }
        };
        const bindWujie = () => {
            const wujie = window.$wujie;
            if (wujie?.bus) {
                wujie.bus.$off('main:change-lang', handleMainChangeLang);
                wujie.bus.$on('main:change-lang', handleMainChangeLang);
                // 若子应用启动时尚未拿到有效语言包，向基座总线主动索取
                if (Object.keys(currentPack.value).length === 0) {
                    wujie.bus.$emit('sub:request-lang', initialLang);
                }
            }
        };
        bindWujie();
        setTimeout(bindWujie, 50);
        setTimeout(bindWujie, 200);
        setTimeout(bindWujie, 600);
    }
    else {
        // 【主基座 / 独立模式】：
        if (typeof window !== 'undefined') {
            const listenSubRequests = () => {
                const wujieBus = window.__WUJIE_BUS__ || window.$wujie?.bus;
                if (wujieBus && typeof wujieBus.$on === 'function') {
                    wujieBus.$on('sub:request-lang', (requestedLang) => {
                        const l = requestedLang || currentLang.value;
                        const pack = vueI18n.global.getLocaleMessage(l) || currentPack.value;
                        if (pack && Object.keys(pack).length > 0) {
                            broadcastLang(l, pack);
                        }
                    });
                }
            };
            setTimeout(listenSubRequests, 0);
            setTimeout(listenSubRequests, 100);
        }
        // 优先读 IndexedDB 离线秒开，后台异步比对版本
        getCachedPack(initialLang).then((cached) => {
            if (cached && cached.data) {
                vueI18n.global.setLocaleMessage(initialLang, cached.data);
                vueI18n.global.locale.value = initialLang;
                currentPack.value = cached.data;
                langTick.value++;
                broadcastLang(initialLang, cached.data, cached.version);
            }
        });
        // 请求版本号列表并比对
        fetchLanguages(apiUrl).then(async (list) => {
            if (list.length > 0) {
                availableLanguages.value = list;
                const currentItem = list.find((item) => item.code === initialLang);
                await loadLanguage(initialLang, currentItem?.version);
                broadcastLang(initialLang, currentPack.value, currentItem?.version);
            }
        });
    }
    const instance = {
        currentLang,
        currentPack,
        loading,
        availableLanguages,
        vueI18n,
        setLang,
        t,
        install(app) {
            // 挂载官方 vue-i18n 插件 (提供官方 $t, v-t, useI18n 支持)
            app.use(vueI18n);
            app.config.globalProperties.$microI18n = instance;
            app.provide(I18N_INJECTION_KEY, instance);
        },
    };
    globalInstance = instance;
    return instance;
}
/**
 * Composition API Hook
 */
export function useMicroI18n() {
    const instance = inject(I18N_INJECTION_KEY, null);
    if (instance) {
        return instance;
    }
    if (globalInstance) {
        return globalInstance;
    }
    throw new Error('[i18n-sdk] useMicroI18n() 必须在 app.use(createMicroI18n()) 之后使用');
}
