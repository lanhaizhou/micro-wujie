import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import zhCN from './locales/zh-CN.json' with { type: 'json' }
import enUS from './locales/en-US.json' with { type: 'json' }

const app = new Hono()

// 允许跨域请求
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

const packs: Record<string, any> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

app.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'micro-i18n-server',
    endpoints: [
      '/api/i18n/languages',
      '/api/i18n/pack?lang=zh-CN',
      '/api/i18n/pack?lang=en-US',
    ],
  })
})

// 返回支持的语言列表及其后端控制的版本号 version
app.get('/api/i18n/languages', (c) => {
  return c.json({
    code: 0,
    data: [
      { code: 'zh-CN', name: '简体中文', version: zhCN.version || '1.0.0', icon: '🇨🇳' },
      { code: 'en-US', name: 'English', version: enUS.version || '1.0.0', icon: '🇺🇸' },
    ],
  })
})

// 获取完整语言包
app.get('/api/i18n/pack', (c) => {
  const lang = c.req.query('lang') || 'zh-CN'
  const pack = packs[lang] || packs['zh-CN']
  return c.json(pack)
})

const port = 3000
console.log(`🚀 [i18n-server] Hono server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
