<script setup lang="ts">
import { ref, computed } from 'vue'
import { DollarSign, Wallet, ArrowDownRight, CreditCard, ArrowUpRight, CheckCircle2 } from '@lucide/vue'
import { useMicroI18n } from 'i18n-sdk'

const { t } = useMicroI18n()

const stats = computed(() => [
  { titleKey: 'finance.gmv', value: '¥3,852,900', change: '+23.4%', isUp: true, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  { titleKey: 'finance.netProfit', value: '¥1,120,400', change: '+8.7%', isUp: true, icon: Wallet, color: 'text-teal-600 bg-teal-50' },
  { titleKey: 'finance.pendingSettlement', value: '¥420,150', change: '18 笔待初审', isUp: false, icon: CreditCard, color: 'text-amber-600 bg-amber-50' },
  { titleKey: 'finance.refundRate', value: '0.32%', change: '-0.05% 环比微降', isUp: true, icon: ArrowDownRight, color: 'text-cyan-600 bg-cyan-50' },
])

const channels = ref([
  { name: '微信支付企业直连', amount: '¥1,890,200', count: '14,200 笔', feeRate: '0.60%', net: '¥1,878,858', status: '正常' },
  { name: '支付宝商户收单', amount: '¥1,340,500', count: '9,850 笔', feeRate: '0.55%', net: '¥1,333,127', status: '正常' },
  { name: '银联云闪付 B2C', amount: '¥420,000', count: '2,100 笔', feeRate: '0.45%', net: '¥418,110', status: '正常' },
  { name: 'Apple Pay / 快捷支付', amount: '¥202,200', count: '1,450 笔', feeRate: '0.80%', net: '¥200,582', status: '正常' },
])

const showToast = ref(false)
const toastMsg = ref('')

const syncFinancialReport = () => {
  toastMsg.value = '已向主基座总控台同步最新财务月结简报'
  showToast.value = true
  setTimeout(() => showToast.value = false, 2500)

  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('finance:notify', {
      type: 'success',
      title: '财务月结快报',
      content: '财务中心已生成最新流水对账单，当月营收 ¥3,852,900 已入账',
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
        <h2 class="text-xl font-bold text-slate-800">{{ t('finance.title') }}</h2>
        <p class="text-sm text-slate-500 mt-1">{{ t('finance.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="syncFinancialReport"
          class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <ArrowUpRight class="w-4 h-4" />
          <span>{{ t('finance.syncReport') }}</span>
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

    <!-- 收单通道概况 -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-slate-800">{{ t('finance.gatewayTitle') }}</h3>
          <p class="text-xs text-slate-400 mt-0.5">{{ t('finance.gatewayDesc') }}</p>
        </div>
        <span class="text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full border border-emerald-100">清算通道全部正常</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50/75 text-xs uppercase font-medium text-slate-500 border-b border-slate-100">
            <tr>
              <th class="px-6 py-3.5">{{ t('finance.gatewayName') }}</th>
              <th class="px-6 py-3.5">{{ t('finance.gatewayAmount') }}</th>
              <th class="px-6 py-3.5">{{ t('finance.gatewayCount') }}</th>
              <th class="px-6 py-3.5">{{ t('finance.gatewayFee') }}</th>
              <th class="px-6 py-3.5">{{ t('finance.gatewayNet') }}</th>
              <th class="px-6 py-3.5 text-right">{{ t('common.status') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-normal">
            <tr v-for="item in channels" :key="item.name" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900">{{ item.name }}</td>
              <td class="px-6 py-4 font-mono font-medium text-slate-900">{{ item.amount }}</td>
              <td class="px-6 py-4">{{ item.count }}</td>
              <td class="px-6 py-4 text-xs font-mono text-slate-500">{{ item.feeRate }}</td>
              <td class="px-6 py-4 font-semibold text-emerald-600 font-mono">{{ item.net }}</td>
              <td class="px-6 py-4 text-right">
                <span class="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
