import { reactive } from 'vue'
import WujieVue from 'wujie-vue3'

export interface UserProfile {
  id: string
  name: string
  role: string
  department: string
  token: string
}

export interface AppNotification {
  id: string
  source: 'ops' | 'finance' | 'system'
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  content: string
  time: string
  read: boolean
}

export interface EventLog {
  id: string
  timestamp: string
  direction: 'main -> sub' | 'sub -> main'
  eventName: string
  sender: string
  payload: any
}

export const usersList: UserProfile[] = [
  { id: 'U-001', name: '张三 (系统管理员)', role: 'SUPER_ADMIN', department: '技术与架构平台部', token: 'jwt-token-admin-98721' },
  { id: 'U-002', name: '李四 (运营总监)', role: 'OPS_DIRECTOR', department: '商业增长运营部', token: 'jwt-token-ops-45123' },
  { id: 'U-003', name: '王五 (财务合规主管)', role: 'FINANCE_LEAD', department: '财务与风控审计部', token: 'jwt-token-fin-78901' },
]

export const state = reactive<{
  currentUser: UserProfile
  notifications: AppNotification[]
  eventLogs: EventLog[]
}>({
  currentUser: usersList[0],
  notifications: [
    {
      id: 'notif-1',
      source: 'system',
      type: 'info',
      title: '系统就绪',
      content: '无界微前端基座已启动，支持跨子应用消息通信与保活机制',
      time: '21:30:00',
      read: false,
    },
  ],
  eventLogs: [],
})

export function addEventLog(direction: EventLog['direction'], eventName: string, sender: string, payload: any) {
  state.eventLogs.unshift({
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString(),
    direction,
    eventName,
    sender,
    payload,
  })
  if (state.eventLogs.length > 50) {
    state.eventLogs.pop()
  }
}

export function switchUser(user: UserProfile) {
  state.currentUser = user
  WujieVue.bus.$emit('main:change-user', user)
  addEventLog('main -> sub', 'main:change-user', '基座主应用', user)
}

export function broadcastMessage(content: string) {
  const payload = {
    message: content,
    sender: state.currentUser.name,
    timestamp: new Date().toLocaleTimeString(),
  }
  WujieVue.bus.$emit('main:broadcast', payload)
  addEventLog('main -> sub', 'main:broadcast', '基座广播', payload)
}

// 统一监听来自子应用的消息
export function initWujieListeners(router: any) {
  WujieVue.bus.$on('ops:notify', (data: any) => {
    state.notifications.unshift({
      id: `notif-${Date.now()}`,
      source: 'ops',
      type: data.type || 'info',
      title: data.title || '运营中心通知',
      content: data.content || '',
      time: data.time || new Date().toLocaleTimeString(),
      read: false,
    })
    addEventLog('sub -> main', 'ops:notify', '运营中心 (ops-app)', data)
  })

  WujieVue.bus.$on('finance:notify', (data: any) => {
    state.notifications.unshift({
      id: `notif-${Date.now()}`,
      source: 'finance',
      type: data.type || 'info',
      title: data.title || '财务中心通知',
      content: data.content || '',
      time: data.time || new Date().toLocaleTimeString(),
      read: false,
    })
    addEventLog('sub -> main', 'finance:notify', '财务中心 (finance-app)', data)
  })

  // 跨应用路由跳转处理
  WujieVue.bus.$on('main:navigate', (path: string) => {
    addEventLog('sub -> main', 'main:navigate', '子应用路由申请', { target: path })
    router.push(path)
  })
}
