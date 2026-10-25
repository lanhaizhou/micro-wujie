<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@lucide/vue'

interface Campaign {
  id: string
  title: string
  type: string
  target: string
  budget: string
  participants: number
  status: 'active' | 'pending' | 'finished'
  startDate: string
  endDate: string
}

const campaigns = ref<Campaign[]>([
  {
    id: 'CMP-2026-001',
    title: '春季会员拉新裂变大作战',
    type: '拼团裂变',
    target: '新注册未下单用户',
    budget: '¥50,000',
    participants: 12450,
    status: 'active',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
  },
  {
    id: 'CMP-2026-002',
    title: '沉睡用户唤醒赠礼活动',
    type: '优惠券召回',
    target: '30天未活跃老用户',
    budget: '¥30,000',
    participants: 8320,
    status: 'active',
    startDate: '2026-10-10',
    endDate: '2026-10-31',
  },
  {
    id: 'CMP-2026-003',
    title: '黑五狂欢预热抽奖',
    type: '积分抽奖',
    target: '全部活跃会员',
    budget: '¥120,000',
    participants: 34100,
    status: 'pending',
    startDate: '2026-11-01',
    endDate: '2026-11-28',
  },
  {
    id: 'CMP-2026-004',
    title: '国庆黄金周特惠促销',
    type: '满减立减',
    target: '全体消费者',
    budget: '¥80,000',
    participants: 58900,
    status: 'finished',
    startDate: '2026-10-01',
    endDate: '2026-10-08',
  },
])

const toggleStatus = (cmp: Campaign) => {
  if (cmp.status === 'active') {
    cmp.status = 'finished'
  } else if (cmp.status === 'pending') {
    cmp.status = 'active'
  } else {
    cmp.status = 'active'
  }

  // 通过 Wujie 事件总线通知基座
  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('ops:notify', {
      type: 'warning',
      title: '活动状态变更',
      content: `活动《${cmp.title}》状态已更新为：${cmp.status === 'active' ? '进行中' : '已暂停/结束'}`,
      time: new Date().toLocaleTimeString(),
    })
  }
}

const showModal = ref(false)
const newTitle = ref('')
const newType = ref('优惠券')
const newBudget = ref('¥20,000')

const createCampaign = () => {
  if (!newTitle.value.trim()) return

  const item: Campaign = {
    id: `CMP-2026-00${campaigns.value.length + 1}`,
    title: newTitle.value,
    type: newType.value,
    target: '指定目标受众',
    budget: newBudget.value,
    participants: 0,
    status: 'active',
    startDate: '2026-10-24',
    endDate: '2026-11-24',
  }

  campaigns.value.unshift(item)
  newTitle.value = ''
  showModal.value = false

  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('ops:notify', {
      type: 'success',
      title: '新建运营活动',
      content: `运营中心新创建活动《${item.title}》，已正式启动生效！`,
      time: new Date().toLocaleTimeString(),
    })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div>
        <h2 class="text-xl font-bold text-slate-800">运营活动管理</h2>
        <p class="text-sm text-slate-500 mt-1">配置与编排多业务线营销活动，观察投放进度与互动规模</p>
      </div>
      <button
        @click="showModal = true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>创建新活动</span>
      </button>
    </div>

    <!-- 活动列表表格 -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50/75 text-xs uppercase font-medium text-slate-500 border-b border-slate-100">
            <tr>
              <th class="px-6 py-3.5">活动编码 & 名称</th>
              <th class="px-6 py-3.5">类型</th>
              <th class="px-6 py-3.5">目标人群</th>
              <th class="px-6 py-3.5">预算</th>
              <th class="px-6 py-3.5">参与人次</th>
              <th class="px-6 py-3.5">状态</th>
              <th class="px-6 py-3.5">活动周期</th>
              <th class="px-6 py-3.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-normal">
            <tr v-for="cmp in campaigns" :key="cmp.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-semibold text-slate-900">{{ cmp.title }}</div>
                <div class="text-xs text-slate-400 font-mono mt-0.5">{{ cmp.id }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded-md font-medium">
                  {{ cmp.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs text-slate-600">{{ cmp.target }}</td>
              <td class="px-6 py-4 font-mono font-medium text-slate-900">{{ cmp.budget }}</td>
              <td class="px-6 py-4 font-semibold text-indigo-600">{{ cmp.participants.toLocaleString() }}</td>
              <td class="px-6 py-4">
                <span
                  v-if="cmp.status === 'active'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  进行中
                </span>
                <span
                  v-else-if="cmp.status === 'pending'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  待上线
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                >
                  已结束
                </span>
              </td>
              <td class="px-6 py-4 text-xs text-slate-500">
                {{ cmp.startDate }} ~ {{ cmp.endDate }}
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="toggleStatus(cmp)"
                  class="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                >
                  {{ cmp.status === 'active' ? '暂停' : '启动' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新建活动弹窗 -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
        <h3 class="text-lg font-bold text-slate-900 mb-4">创建新运营活动</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">活动名称</label>
            <input
              v-model="newTitle"
              type="text"
              placeholder="例如：双十一返场狂欢折扣"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">活动类型</label>
            <select
              v-model="newType"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option>拼团裂变</option>
              <option>满减优惠券</option>
              <option>积分抽奖</option>
              <option>限时秒杀</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">活动预算</label>
            <input
              v-model="newBudget"
              type="text"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-6">
          <button
            @click="showModal = false"
            class="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            取消
          </button>
          <button
            @click="createCampaign"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg cursor-pointer"
          >
            确认创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
