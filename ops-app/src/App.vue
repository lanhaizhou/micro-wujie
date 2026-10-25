<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Megaphone, Cpu, ExternalLink } from '@lucide/vue'
import { useMicroI18n } from 'i18n-sdk'

const route = useRoute()
const router = useRouter()
const isWujie = ref(!!window.__POWERED_BY_WUJIE__)
const { t } = useMicroI18n()

const navTabs = computed(() => [
  { nameKey: 'ops.tabOverview', path: '/overview', icon: LayoutDashboard },
  { nameKey: 'ops.tabCampaigns', path: '/campaigns', icon: Megaphone },
  { nameKey: 'ops.tabWujie', path: '/wujie-demo', icon: Cpu },
])

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans">
    <!-- 独立运行模式的顶部 Header -->
    <header v-if="!isWujie" class="bg-indigo-900 text-white shadow-sm border-b border-indigo-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center font-bold text-sm">
            营
          </div>
          <div>
            <h1 class="font-bold text-sm tracking-wide">{{ t('ops.title') }} (Operations Sub-System)</h1>
            <p class="text-[11px] text-indigo-300">当前处于【独立运行模式】• 端口 http://localhost:5101</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a
            href="http://localhost:5100"
            target="_blank"
            class="text-xs bg-indigo-800 hover:bg-indigo-700 text-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-600 transition-colors inline-flex items-center gap-1.5"
          >
            <span>返回基座主入口</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>

    <!-- 微前端环境下的辅助子导航栏 -->
    <div class="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- 标签页导航 -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            v-for="tab in navTabs"
            :key="tab.path"
            @click="navigate(tab.path)"
            :class="[
              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
              route.path === tab.path
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <component :is="tab.icon" class="w-3.5 h-3.5" />
            <span>{{ t(tab.nameKey) }}</span>
          </button>
        </div>

        <!-- 状态标签 -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400">子系统标识:</span>
          <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono font-medium border border-indigo-100">ops-app:5101</span>
          <span
            v-if="isWujie"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100 text-[11px]"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            基座挂载中
          </span>
        </div>
      </div>
    </div>

    <!-- 子页面内容容器 -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
      <router-view />
    </main>
  </div>
</template>
