import { createApp } from 'vue'
import WujieVue from 'wujie-vue3'
import { createMicroI18n } from 'i18n-sdk'
import App from './App.vue'
import router from './router'
import { initWujieListeners, addEventLog } from './state/bus'
import './style.css'

const { setupApp, preloadApp } = WujieVue

// 预配置子应用基本信息
setupApp({
  name: 'ops',
  url: 'http://localhost:5101/',
  alive: true,
  sync: true,
})

setupApp({
  name: 'finance',
  url: 'http://localhost:5102/',
  alive: true,
  sync: true,
})

// 预加载子应用，实现快速切换秒开
preloadApp({ name: 'ops', url: 'http://localhost:5101/' })
preloadApp({ name: 'finance', url: 'http://localhost:5102/' })

// 初始化多语言 SDK (基于 Hono 服务下发 + IndexedDB 本地持久化缓存)
const i18n = createMicroI18n({
  apiUrl: 'http://localhost:3000',
  defaultLang: 'zh-CN',
  onLangChange(lang) {
    WujieVue.bus.$emit('main:change-lang', lang)
    addEventLog('main -> sub', 'main:change-lang', '基座语言切换广播', { lang })
  },
})

const app = createApp(App)
app.use(router)
app.use(WujieVue)
app.use(i18n)

// 暴露无界事件总线到全局，供 SDK 自动分发多语言广播
if (typeof window !== 'undefined') {
  (window as any).__WUJIE_BUS__ = WujieVue.bus
}

// 注册全局总线监听
initWujieListeners(router)

app.mount('#app')
