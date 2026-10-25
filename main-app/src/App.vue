<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Megaphone,
  ReceiptText,
  Bell,
  Radio,
  ExternalLink,
  ChevronDown,
  Layers,
  Send,
  Check,
  X,
  Globe
} from '@lucide/vue'
import { useMicroI18n } from 'i18n-sdk'
import { state, usersList, switchUser, broadcastMessage } from './state/bus'

const route = useRoute()
const { currentLang, setLang, availableLanguages, t } = useMicroI18n()

const navItems = computed(() => [
  { nameKey: 'main.navDashboard', path: '/dashboard', icon: LayoutDashboard },
  { nameKey: 'main.navOps', path: '/ops', icon: Megaphone, badge: '5101' },
  { nameKey: 'main.navFinance', path: '/finance', icon: ReceiptText, badge: '5102' },
])

const showUserMenu = ref(false)
const showNotifMenu = ref(false)
const showLangMenu = ref(false)
const showBroadcastModal = ref(false)
const broadcastText = ref('')

const unreadNotifs = computed(() => state.notifications.filter(n => !n.read))

const handleBroadcastSubmit = () => {
  if (!broadcastText.value.trim()) return
  broadcastMessage(broadcastText.value)
  broadcastText.value = ''
  showBroadcastModal.value = false
}

const markAllRead = () => {
  state.notifications.forEach(n => (n.read = true))
}

const openExternal = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans antialiased">
    <!-- 左侧侧边栏 Sidebar -->
    <aside class="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800">
      <!-- 品牌 Logo -->
      <div class="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
          <Layers class="w-5 h-5" />
        </div>
        <div>
          <h1 class="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
            MicroAdmin
            <span class="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-mono">wujie</span>
          </h1>
          <p class="text-[11px] text-slate-400">{{ t('main.subtitle') }}</p>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {{ t('main.appName') }}
        </div>

        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group',
            route.path.startsWith(item.path)
              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <div class="flex items-center gap-3">
            <component :is="item.icon" class="w-4 h-4 text-slate-400 group-hover:text-white" />
            <span>{{ t(item.nameKey) }}</span>
          </div>
          <span
            v-if="item.badge"
            :class="[
              'text-[10px] px-1.5 py-0.5 rounded font-mono font-bold',
              route.path.startsWith(item.path) ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
            ]"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- 底部微前端子系统运行状态监控 -->
      <div class="p-3 border-t border-slate-800 space-y-2">
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs space-y-2">
          <div class="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
            <span>{{ t('common.wujieMode') }} (Wujie)</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <!-- ops -->
          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-1.5 text-[11px] text-slate-300">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>{{ t('ops.title').slice(0, 4) }}</span>
              <span class="font-mono text-slate-500 text-[10px]">:5101</span>
            </div>
            <button
              @click="openExternal('http://localhost:5101')"
              class="text-slate-400 hover:text-white transition-colors cursor-pointer"
              :title="t('common.standalone')"
            >
              <ExternalLink class="w-3 h-3" />
            </button>
          </div>

          <!-- finance -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-[11px] text-slate-300">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{{ t('finance.title').slice(0, 4) }}</span>
              <span class="font-mono text-slate-500 text-[10px]">:5102</span>
            </div>
            <button
              @click="openExternal('http://localhost:5102')"
              class="text-slate-400 hover:text-white transition-colors cursor-pointer"
              :title="t('common.standalone')"
            >
              <ExternalLink class="w-3 h-3" />
            </button>
          </div>
        </div>

        <div class="text-[10px] text-slate-500 text-center py-1">
          Hono i18n • idb-keyval • Wujie
        </div>
      </div>
    </aside>

    <!-- 右侧主体内容区 Main Layout -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- 顶部 Header -->
      <header class="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
        <!-- 页面面包屑 / 标题 -->
        <div class="flex items-center gap-3">
          <h2 class="text-sm font-bold text-slate-800">
            {{ route.path === '/dashboard' ? t('main.navDashboard') : route.path.startsWith('/ops') ? t('main.navOps') : t('main.navFinance') }}
          </h2>
          <span class="text-xs text-slate-400 font-mono">/</span>
          <span class="text-xs text-slate-500 font-mono">{{ route.path }}</span>
        </div>

        <!-- 顶部快捷操作与用户信息 -->
        <div class="flex items-center gap-3">
          <!-- 多语言切换器 (基于 Hono + IndexedDB + Wujie 同步) -->
          <div class="relative">
            <button
              @click="showLangMenu = !showLangMenu"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200"
              :title="t('common.switchLang')"
            >
              <Globe class="w-3.5 h-3.5 text-indigo-600" />
              <span>{{ currentLang === 'zh-CN' ? '🇨🇳 简体中文' : '🇺🇸 English' }}</span>
              <ChevronDown class="w-3 h-3 text-slate-400" />
            </button>

            <!-- 语言切换下拉菜单 -->
            <div
              v-if="showLangMenu"
              class="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 text-xs space-y-1"
            >
              <div class="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                选择语言 (多端同步)
              </div>
              <button
                v-for="l in availableLanguages"
                :key="l.code"
                @click="setLang(l.code); showLangMenu = false"
                :class="[
                  'w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors text-xs',
                  currentLang === l.code ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                ]"
              >
                <div class="flex items-center gap-2">
                  <span>{{ l.icon || '🌐' }}</span>
                  <span>{{ l.name }}</span>
                </div>
                <Check v-if="currentLang === l.code" class="w-3.5 h-3.5 text-indigo-600" />
              </button>
            </div>
          </div>

          <!-- 全局广播按钮 -->
          <button
            @click="showBroadcastModal = true"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            :title="t('main.broadcastModalTitle')"
          >
            <Radio class="w-3.5 h-3.5 text-indigo-600" />
            <span>{{ t('main.broadcastBtn') }}</span>
          </button>

          <!-- 消息通知铃铛 -->
          <div class="relative">
            <button
              @click="showNotifMenu = !showNotifMenu"
              class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Bell class="w-4 h-4" />
              <span
                v-if="unreadNotifs.length > 0"
                class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"
              ></span>
            </button>

            <!-- 通知下拉面板 -->
            <div
              v-if="showNotifMenu"
              class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-3"
            >
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <span class="font-bold text-slate-800 text-sm">{{ t('main.notifTitle') }}</span>
                <button
                  @click="markAllRead"
                  class="text-[11px] text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  {{ t('main.markAllRead') }}
                </button>
              </div>

              <div class="max-h-64 overflow-y-auto space-y-2">
                <div v-if="state.notifications.length === 0" class="text-center py-6 text-slate-400">
                  {{ t('main.noNotif') }}
                </div>
                <div
                  v-for="n in state.notifications"
                  :key="n.id"
                  class="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors space-y-1"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-semibold text-slate-800">{{ n.title }}</span>
                    <span class="text-[10px] text-slate-400">{{ n.time }}</span>
                  </div>
                  <p class="text-slate-600 text-[11px] leading-relaxed">{{ n.content }}</p>
                  <div class="text-[10px] text-slate-400 font-mono">来源: {{ n.source }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 用户身份切换器 (演示跨微前端透传不同权限身份) -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
            >
              <div class="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {{ state.currentUser.name[0] }}
              </div>
              <div class="text-left hidden sm:block">
                <div class="font-semibold text-slate-800">{{ state.currentUser.name }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ state.currentUser.role }}</div>
              </div>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400" />
            </button>

            <!-- 用户切换下拉 -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1"
            >
              <div class="px-3 py-2 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                切换当前操作身份 (同步至子应用)
              </div>
              <button
                v-for="user in usersList"
                :key="user.id"
                @click="switchUser(user); showUserMenu = false"
                class="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div class="font-semibold text-slate-800">{{ user.name }}</div>
                  <div class="text-[11px] text-slate-500">{{ user.department }}</div>
                </div>
                <Check v-if="state.currentUser.id === user.id" class="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 页面内容路由插槽 -->
      <main class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </main>
    </div>

    <!-- 全局广播弹窗 -->
    <div v-if="showBroadcastModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-slate-900 text-base">{{ t('main.broadcastModalTitle') }}</h3>
          <button @click="showBroadcastModal = false" class="text-slate-400 hover:text-slate-600">
            <X class="w-4 h-4" />
          </button>
        </div>
        <p class="text-xs text-slate-500 mb-3">
          {{ t('main.broadcastModalDesc') }}
        </p>
        <textarea
          v-model="broadcastText"
          rows="3"
          placeholder="输入要广播给所有子应用的通知内容..."
          class="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 mb-4"
        ></textarea>
        <div class="flex items-center justify-end gap-2">
          <button
            @click="showBroadcastModal = false"
            class="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            @click="handleBroadcastSubmit"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer inline-flex items-center gap-1.5"
          >
            <Send class="w-3.5 h-3.5" />
            <span>{{ t('main.sendBroadcast') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
