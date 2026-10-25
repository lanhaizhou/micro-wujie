import { createApp } from 'vue'
import { createMicroI18n } from 'i18n-sdk'
import App from './App.vue'
import router from './router'
import './style.css'

let instance: ReturnType<typeof createApp> | null = null

declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean
    __WUJIE_MOUNT?: () => void
    __WUJIE_UNMOUNT?: () => void
    $wujie?: {
      bus: {
        $on: (event: string, callback: (...args: any[]) => void) => void
        $emit: (event: string, ...args: any[]) => void
        $off: (event: string, callback?: (...args: any[]) => void) => void
      }
      props?: Record<string, any>
      id?: string
    }
  }
}

function render() {
  const app = createApp(App)
  app.use(router)

  // 接入多语言 SDK (纯远程 JSON + IndexedDB 本地缓存 + Wujie 自动监听)
  const i18n = createMicroI18n({
    apiUrl: 'http://localhost:3000',
    defaultLang: 'zh-CN',
  })
  app.use(i18n)

  app.mount('#app')
  instance = app
}

// 独立运行时直接渲染
if (!window.__POWERED_BY_WUJIE__) {
  render()
}

// 无界微前端生命周期钩子
window.__WUJIE_MOUNT = () => {
  render()
}

window.__WUJIE_UNMOUNT = () => {
  instance?.unmount()
  instance = null
}
