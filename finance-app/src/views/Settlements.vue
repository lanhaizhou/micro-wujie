<script setup lang="ts">
import { ref } from 'vue'
import { CheckCheck } from '@lucide/vue'

interface Settlement {
  id: string
  merchant: string
  type: string
  amount: string
  fee: string
  channel: string
  status: 'settled' | 'pending' | 'reviewing'
  date: string
}

const settlements = ref<Settlement[]>([
  {
    id: 'TXN-20261024-8801',
    merchant: '星耀数字创意工作室',
    type: '创作者收益提现',
    amount: '¥48,200.00',
    fee: '¥144.60',
    channel: '招商银行对公账户',
    status: 'pending',
    date: '2026-10-24 18:32',
  },
  {
    id: 'TXN-20261024-8802',
    merchant: '智图云端算力服务商',
    type: '平台技术分账',
    amount: '¥126,500.00',
    fee: '¥379.50',
    channel: '工商银行对公结算',
    status: 'pending',
    date: '2026-10-24 16:15',
  },
  {
    id: 'TXN-20261023-8799',
    merchant: '极速物流供应链',
    type: '运费服务结算',
    amount: '¥32,800.00',
    fee: '¥98.40',
    channel: '微信企业付款',
    status: 'settled',
    date: '2026-10-23 20:04',
  },
  {
    id: 'TXN-20261023-8798',
    merchant: '天元互动科技有限公司',
    type: '广告分成款',
    amount: '¥85,400.00',
    fee: '¥256.20',
    channel: '支付宝批量代发',
    status: 'settled',
    date: '2026-10-23 14:22',
  },
  {
    id: 'TXN-20261022-8785',
    merchant: '微光文化传播',
    type: '版权买断结算',
    amount: '¥210,000.00',
    fee: '¥630.00',
    channel: '建设银行对公账户',
    status: 'reviewing',
    date: '2026-10-22 11:10',
  },
])

const filterTab = ref('all')

const confirmSettlement = (item: Settlement) => {
  item.status = 'settled'

  // 发送消息通知基座
  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('finance:notify', {
      type: 'success',
      title: '结算打款完成',
      content: `流水单 ${item.id} (${item.merchant}) 金额 ${item.amount} 财务初审已放行，银行出金完成！`,
      time: new Date().toLocaleTimeString(),
    })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div>
        <h2 class="text-xl font-bold text-slate-800">商户与渠道结算流水</h2>
        <p class="text-sm text-slate-500 mt-1">审核各商户分成提现、服务对账单并执行资金划拨放行</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-500">待办结算项:</span>
        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">2 笔待审核出金</span>
      </div>
    </div>

    <!-- 列表展示 -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div class="flex items-center gap-1">
          <button
            @click="filterTab = 'all'"
            :class="['px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors', filterTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100']"
          >
            全部结算记录
          </button>
          <button
            @click="filterTab = 'pending'"
            :class="['px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors', filterTab === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100']"
          >
            待出金审核
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50/75 text-xs uppercase font-medium text-slate-500 border-b border-slate-100">
            <tr>
              <th class="px-6 py-3.5">交易流水号 & 结算方</th>
              <th class="px-6 py-3.5">结算类型</th>
              <th class="px-6 py-3.5">结算金额</th>
              <th class="px-6 py-3.5">代扣税费</th>
              <th class="px-6 py-3.5">清算通道</th>
              <th class="px-6 py-3.5">状态</th>
              <th class="px-6 py-3.5">发起时间</th>
              <th class="px-6 py-3.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-normal">
            <tr
              v-for="item in settlements.filter(s => filterTab === 'all' || s.status === filterTab)"
              :key="item.id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="font-semibold text-slate-900">{{ item.merchant }}</div>
                <div class="text-xs text-slate-400 font-mono mt-0.5">{{ item.id }}</div>
              </td>
              <td class="px-6 py-4 text-xs font-medium text-slate-700">{{ item.type }}</td>
              <td class="px-6 py-4 font-mono font-bold text-slate-900">{{ item.amount }}</td>
              <td class="px-6 py-4 font-mono text-xs text-slate-500">{{ item.fee }}</td>
              <td class="px-6 py-4 text-xs text-slate-600">{{ item.channel }}</td>
              <td class="px-6 py-4">
                <span
                  v-if="item.status === 'settled'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  已划拨
                </span>
                <span
                  v-else-if="item.status === 'pending'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  待出金
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200"
                >
                  合规审查中
                </span>
              </td>
              <td class="px-6 py-4 text-xs text-slate-400 font-mono">{{ item.date }}</td>
              <td class="px-6 py-4 text-right">
                <button
                  v-if="item.status === 'pending'"
                  @click="confirmSettlement(item)"
                  class="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                >
                  <CheckCheck class="w-3.5 h-3.5" />
                  <span>放行划拨</span>
                </button>
                <span v-else class="text-xs text-slate-400">已存档</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
