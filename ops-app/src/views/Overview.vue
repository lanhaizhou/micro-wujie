<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, TrendingUp, UserPlus, Flame, ArrowUpRight, CheckCircle2 } from '@lucide/vue'
import { useMicroI18n } from 'i18n-sdk'

const { t } = useMicroI18n()

const stats = computed(() => [
  { titleKey: 'ops.mau', value: '1,284,500', change: '+12.5%', isUp: true, icon: Users, color: 'text-blue-600 bg-blue-50' },
  { titleKey: 'ops.rate', value: '4.82%', change: '+0.65%', isUp: true, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
  { titleKey: 'ops.newUsers', value: '3,280', change: '+18.2%', isUp: true, icon: UserPlus, color: 'text-violet-600 bg-violet-50' },
  { titleKey: 'ops.activeCampaigns', value: '8 个', change: '预算使用率 64%', isUp: true, icon: Flame, color: 'text-amber-600 bg-amber-50' },
])

const channels = ref([
  { name: '微信裂变分享', visitors: '452,100', conversions: '24,800', rate: '5.48%', roi: '3.8x', status: '优秀' },
  { name: '抖音信息流投放', visitors: '389,000', conversions: '18,500', rate: '4.75%', roi: '2.9x', status: '良好' },
  { name: '各大应用市场 ASO', visitors: '280,400', conversions: '16,200', rate: '5.77%', roi: '4.2x', status: '优秀' },
  { name: 'B站 KOL 种草', visitors: '163,000', conversions: '6,900', rate: '4.23%', roi: '2.1x', status: '平稳' },
])

const showToast = ref(false)
const toastMsg = ref('')

const triggerSync = () => {
  toastMsg.value = '已同步最新运营数据至基座数据中心'
  showToast.value = true
  setTimeout(() => showToast.value = false, 2500)

  // 如果在微前端环境，向基座通知
  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('ops:notify', {
      type: 'info',
      title: '运营数据同步',
      content: '运营中心已同步最新营销报表与核心转化数据',
      time: new Date().toLocaleTimeString(),
    })
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 提示框 -->
    <div v-if="showToast" class="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm transition-all animate-bounce">
      <CheckCircle2 class="w-4 h-4" />
      <span>{{ toastMsg }}</span>
    </div>

    <!-- 顶部欢迎栏 -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div>
        <h2 class="text-xl font-bold text-slate-800">{{ t('ops.title') }}</h2>
        <p class="text-sm text-slate-500 mt-1">{{ t('ops.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="triggerSync"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <ArrowUpRight class="w-4 h-4" />
          <span>{{ t('ops.syncReport') }}</span>
        </button>
      </div>
    </div>

    <!-- 指标卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.titleKey"
        class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500">{{ t(stat.titleKey) }}</span>
          <div :class="['p-2 rounded-lg', stat.color]">
            <component :is="stat.icon" class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-bold text-slate-900 tracking-tight">{{ stat.value }}</div>
          <div class="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <span>{{ stat.change }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 渠道转化分析 -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-slate-800">{{ t('ops.channelTitle') }}</h3>
          <p class="text-xs text-slate-400 mt-0.5">{{ t('ops.channelDesc') }}</p>
        </div>
        <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">实时计算</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50/75 text-xs uppercase font-medium text-slate-500 border-b border-slate-100">
            <tr>
              <th class="px-6 py-3.5">{{ t('ops.channelName') }}</th>
              <th class="px-6 py-3.5">{{ t('ops.channelVisitors') }}</th>
              <th class="px-6 py-3.5">{{ t('ops.channelConversions') }}</th>
              <th class="px-6 py-3.5">{{ t('ops.channelRate') }}</th>
              <th class="px-6 py-3.5">{{ t('ops.channelRoi') }}</th>
              <th class="px-6 py-3.5 text-right">{{ t('ops.channelStatus') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-normal">
            <tr v-for="item in channels" :key="item.name" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900">{{ item.name }}</td>
              <td class="px-6 py-4">{{ item.visitors }}</td>
              <td class="px-6 py-4">{{ item.conversions }}</td>
              <td class="px-6 py-4 font-semibold text-indigo-600">{{ item.rate }}</td>
              <td class="px-6 py-4 text-emerald-600 font-medium">{{ item.roi }}</td>
              <td class="px-6 py-4 text-right">
                <span
                  :class="[
                    'inline-block text-xs font-medium px-2 py-0.5 rounded-full',
                    item.status === '优秀' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
