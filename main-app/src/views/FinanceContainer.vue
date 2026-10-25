<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import WujieVue from 'wujie-vue3'
import { state } from '../state/bus'
import { useMicroI18n } from 'i18n-sdk'
import { RefreshCw, ExternalLink } from '@lucide/vue'

const router = useRouter()
const isRefreshing = ref(false)
const { currentLang, currentPack, t } = useMicroI18n()

const subAppProps = computed(() => ({
  user: state.currentUser,
  token: state.currentUser.token,
  role: state.currentUser.role,
  lang: currentLang.value,
  langPack: currentPack.value,
  jump: (path: string) => router.push(path),
}))

const handleRefresh = async () => {
  isRefreshing.value = true
  try {
    if (typeof WujieVue.destroyApp === 'function') {
      WujieVue.destroyApp('finance')
    }
  } catch (e) {
    console.error(e)
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
    }, 400)
  }
}

const openStandalone = () => {
  window.open('http://localhost:5102', '_blank')
}
</script>

<template>
  <div class="h-full flex flex-col space-y-4">
    <!-- 子系统顶部控制栏 -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
          财
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="font-bold text-slate-900 text-sm">财务中心微前端容器</h2>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              无界沙箱加载 (保活模式 alive=true)
            </span>
          </div>
          <p class="text-xs text-slate-400 font-mono mt-0.5">
            嵌入目标地址: http://localhost:5102 • 注入当前身份: {{ state.currentUser.name }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="handleRefresh"
          :disabled="isRefreshing"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          title="强制刷新并重新激活子应用沙箱"
        >
          <RefreshCw :class="['w-3.5 h-3.5', isRefreshing && 'animate-spin']" />
          <span>{{ t('common.reload') }}</span>
        </button>

        <button
          @click="openStandalone"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          :title="t('common.standalone')"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>{{ t('common.standalone') }}</span>
        </button>
      </div>
    </div>

    <!-- 无界微前端挂载容器 -->
    <div class="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative min-h-[720px]">
      <WujieVue
        width="100%"
        height="100%"
        name="finance"
        url="http://localhost:5102/"
        :sync="true"
        :alive="true"
        :props="subAppProps"
      />
    </div>
  </div>
</template>
