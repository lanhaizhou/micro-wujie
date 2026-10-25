<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { state, broadcastMessage } from '../state/bus'
import { useMicroI18n } from 'i18n-sdk'
import {
  Layers,
  ArrowRight,
  ExternalLink,
  Send,
  Radio,
  CheckCircle2,
  Box,
  Cpu,
  Share2
} from '@lucide/vue'

const router = useRouter()
const { t } = useMicroI18n()
const broadcastInput = ref('主基座系统广播：平台将于今晚进行微前端模块热更新，请各子系统保持通信正常。')
const showToast = ref(false)

const triggerBroadcast = () => {
  if (!broadcastInput.value.trim()) return
  broadcastMessage(broadcastInput.value)
  showToast.value = true
  setTimeout(() => showToast.value = false, 2500)
}

const goToApp = (path: string) => {
  router.push(path)
}

const openExternal = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 提示框 -->
    <div v-if="showToast" class="fixed top-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm transition-all animate-bounce">
      <CheckCircle2 class="w-4 h-4" />
      <span>已通过 Wujie EventBus 广播至所有子应用</span>
    </div>

    <!-- 欢迎大卡片 -->
    <div class="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-lg border border-slate-800">
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
          <Layers class="w-3.5 h-3.5" />
          <span>无界 (Wujie) 企业级微前端架构控制台</span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {{ t('main.heroTitle') }}
        </h1>
        <p class="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          {{ t('main.heroDesc') }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <button
            @click="goToApp('/ops')"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{{ t('main.enterOps') }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
          <button
            @click="goToApp('/finance')"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{{ t('main.enterFinance') }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- 背景光晕装饰 -->
      <div class="absolute -right-10 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute right-40 top-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>

    <!-- 微前端架构拓扑卡片 -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
          <Share2 class="w-4 h-4 text-indigo-600" />
          {{ t('main.topologyTitle') }}
        </h2>
        <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono">{{ t('main.topologyNote') }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 主基座 -->
        <div class="bg-slate-50 border-2 border-indigo-500/40 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
            主基座 Host
          </div>
          <div>
            <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base mb-3">
              M
            </div>
            <h3 class="font-bold text-slate-900 text-sm">main-app (基座主控台)</h3>
            <p class="text-xs text-slate-500 mt-1">负责全局导航、统一鉴权、生命周期管控、事件总线分发与子应用嵌合。</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span class="text-slate-400">服务端口:</span>
            <span class="font-mono font-bold text-indigo-600">http://localhost:5100</span>
          </div>
        </div>

        <!-- 运营子系统 -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-indigo-300 transition-colors">
          <div class="absolute top-0 right-0 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
            子系统 Sub 1
          </div>
          <div>
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base mb-3">
              营
            </div>
            <h3 class="font-bold text-slate-900 text-sm">ops-app (运营中心)</h3>
            <p class="text-xs text-slate-500 mt-1">独立前端系统，涵盖运营大盘数据监控、营销活动编排与转化归因看板。</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span class="text-slate-400">服务端口:</span>
            <span class="font-mono font-bold text-indigo-600">http://localhost:5101</span>
          </div>
        </div>

        <!-- 财务子系统 -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div class="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
            子系统 Sub 2
          </div>
          <div>
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base mb-3">
              财
            </div>
            <h3 class="font-bold text-slate-900 text-sm">finance-app (财务中心)</h3>
            <p class="text-xs text-slate-500 mt-1">独立前端系统，负责财务营收对账、商户打款划拨初审及清算流水管控。</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span class="text-slate-400">服务端口:</span>
            <span class="font-mono font-bold text-emerald-600">http://localhost:5102</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 子系统访问卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 运营中心卡片 -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Box class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900">运营中心 (ops-app)</h3>
                <p class="text-xs text-slate-400 font-mono">http://localhost:5101</p>
              </div>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              支持微前端 / 独立运行
            </span>
          </div>

          <p class="text-xs text-slate-600 mt-4 leading-relaxed">
            内置运营大盘概览、活动编排管理以及微前端环境沙箱探测功能。能够接收基座传递的用户 Token 与全局通知，亦可主动向基座上报事件。
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">Vue 3.5.44</span>
            <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">Vite 8</span>
            <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">Tailwind v4</span>
            <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">TypeScript</span>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center gap-3">
          <button
            @click="goToApp('/ops')"
            class="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>在基座中嵌入加载 (Wujie)</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
          <button
            @click="openExternal('http://localhost:5101')"
            class="py-2.5 px-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="在新标签页作为独立工程打开"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>独立打开</span>
          </button>
        </div>
      </div>

      <!-- 财务中心卡片 -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Cpu class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900">财务中心 (finance-app)</h3>
                <p class="text-xs text-slate-400 font-mono">http://localhost:5102</p>
              </div>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              支持微前端 / 独立运行
            </span>
          </div>

          <p class="text-xs text-slate-600 mt-4 leading-relaxed">
            内置财务营收监控、商户结算打款审核与多通道支付对账流水。支持一键将打款成功或账务预警通过 Wujie Bus 上报至主基座。
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">Vue 3.5.44</span>
            <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">Vite 8</span>
            <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">Tailwind v4</span>
            <span class="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">TypeScript</span>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center gap-3">
          <button
            @click="goToApp('/finance')"
            class="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>在基座中嵌入加载 (Wujie)</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
          <button
            @click="openExternal('http://localhost:5102')"
            class="py-2.5 px-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="在新标签页作为独立工程打开"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>独立打开</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 事件总线实时监控与测试交互面板 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 快速广播测试 -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <h3 class="font-bold text-slate-900 flex items-center gap-2">
            <Radio class="w-4 h-4 text-indigo-600" />
            基座全局广播测试
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            向所有已加载的微前端子应用实时推送 `main:broadcast` 消息
          </p>

          <div class="mt-4 space-y-2">
            <textarea
              v-model="broadcastInput"
              rows="3"
              class="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
        </div>

        <button
          @click="triggerBroadcast"
          class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send class="w-3.5 h-3.5" />
          <span>立即向子应用广播消息</span>
        </button>
      </div>

      <!-- 实时总线日志流 -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-slate-900 text-sm">无界事件总线通信日志流 (Live Stream)</h3>
            <span class="text-xs font-mono text-slate-400">总计 {{ state.eventLogs.length }} 条事件</span>
          </div>

          <div class="max-h-60 overflow-y-auto space-y-2 rounded-xl bg-slate-900 p-3 text-slate-100 font-mono text-[11px]">
            <div v-if="state.eventLogs.length === 0" class="text-slate-500 text-center py-8">
              暂无跨系统事件流。可以在上方点击广播或进入运营/财务中心触发上报测试！
            </div>
            <div
              v-for="ev in state.eventLogs"
              :key="ev.id"
              class="p-2 rounded bg-slate-800/80 border border-slate-700/60 space-y-1"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'px-1.5 py-0.5 rounded text-[10px] font-bold',
                      ev.direction === 'main -> sub' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                    ]"
                  >
                    {{ ev.direction }}
                  </span>
                  <span class="text-amber-400 font-semibold">{{ ev.eventName }}</span>
                </div>
                <span class="text-slate-400 text-[10px]">{{ ev.timestamp }}</span>
              </div>
              <div class="text-slate-300 text-[10px] truncate">
                发送方: <span class="text-slate-100 font-bold">{{ ev.sender }}</span> | 负载: {{ JSON.stringify(ev.payload) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
