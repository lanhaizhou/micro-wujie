<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Send, Radio, ShieldCheck, BellRing } from '@lucide/vue'

const isWujie = ref(!!window.__POWERED_BY_WUJIE__)
const propsReceived = ref<any>(window.$wujie?.props || { note: '当前为独立运行，暂无基座传递 Props' })
const customMessage = ref('运营中心向全基座通报：今日DAU突破历史峰值！')
const receivedLogs = ref<Array<{ time: string; event: string; payload: any }>>([])

// 监听基座发来的消息
const handleBroadcast = (data: any) => {
  receivedLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    event: 'main:broadcast (基座全员广播)',
    payload: data,
  })
}

const handleUserChange = (data: any) => {
  receivedLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    event: 'main:change-user (基座切换用户)',
    payload: data,
  })
  if (window.$wujie?.props) {
    propsReceived.value = { ...window.$wujie.props, user: data }
  }
}

onMounted(() => {
  if (window.$wujie?.bus) {
    window.$wujie.bus.$on('main:broadcast', handleBroadcast)
    window.$wujie.bus.$on('main:change-user', handleUserChange)
  }
})

onUnmounted(() => {
  if (window.$wujie?.bus) {
    window.$wujie.bus.$off('main:broadcast', handleBroadcast)
    window.$wujie.bus.$off('main:change-user', handleUserChange)
  }
})

// 发送消息给基座
const emitToMain = () => {
  if (!customMessage.value.trim()) return

  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('ops:notify', {
      type: 'info',
      title: '来自运营中心的自定义上报',
      content: customMessage.value,
      time: new Date().toLocaleTimeString(),
    })
  } else {
    alert('当前非微前端环境，无法通过 Wujie Bus 发送消息给基座')
  }
}

// 跨应用路由跳转测试
const jumpToFinance = () => {
  if (window.$wujie?.props?.jump) {
    window.$wujie.props.jump('/finance')
  } else if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('main:navigate', '/finance')
  } else {
    window.location.href = 'http://localhost:5102'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
          <Radio class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800">无界 (Wujie) 微前端联动与通讯</h2>
          <p class="text-sm text-slate-500 mt-0.5">测试主基座与运营子系统之间的沙箱隔离、Props 注入与事件总线交互</p>
        </div>
      </div>
    </div>

    <!-- 运行环境状态 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 class="font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-indigo-600" />
          微前端运行环境检测
        </h3>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">运行模式</span>
            <span
              :class="[
                'px-2.5 py-1 rounded-full text-xs font-semibold',
                isWujie ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              ]"
            >
              {{ isWujie ? '🟢 无界微前端沙箱加载' : '🔵 独立运行模式 (Standalone)' }}
            </span>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">window.__POWERED_BY_WUJIE__</span>
            <span class="font-mono text-xs font-semibold text-slate-700">{{ isWujie ? 'true' : 'false' }}</span>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">服务端口</span>
            <span class="font-mono text-xs font-semibold text-indigo-600">5101</span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">基座通过 Props 传递的数据</h4>
          <pre class="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">{{ JSON.stringify(propsReceived, null, 2) }}</pre>
        </div>

        <div class="pt-2">
          <button
            @click="jumpToFinance"
            class="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>调用基座路由切换：直接跳转到【财务中心】</span>
          </button>
        </div>
      </div>

      <!-- 发送消息与总线监听 -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
        <div class="space-y-4">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <BellRing class="w-4 h-4 text-indigo-600" />
            跨应用事件总线通信 (Bus Emit)
          </h3>

          <div class="space-y-2">
            <label class="block text-xs font-medium text-slate-600">向基座发送通知内容</label>
            <div class="flex gap-2">
              <input
                v-model="customMessage"
                type="text"
                class="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                @click="emitToMain"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send class="w-3.5 h-3.5" />
                <span>触发 Emit</span>
              </button>
            </div>
            <p class="text-xs text-slate-400">基座顶部的通知铃铛将接收该消息并弹出 Toast 提示</p>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">收到的基座事件日志 (最近)</h4>
            <div class="max-h-52 overflow-y-auto space-y-2 border border-slate-100 rounded-lg p-2 bg-slate-50">
              <div v-if="receivedLogs.length === 0" class="text-xs text-slate-400 text-center py-6">
                暂无接收到的总线事件（可以在基座顶部点击广播按钮测试）
              </div>
              <div
                v-for="(log, idx) in receivedLogs"
                :key="idx"
                class="p-2.5 rounded bg-white border border-slate-200/60 text-xs space-y-1"
              >
                <div class="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                  <span class="font-semibold text-indigo-600">{{ log.event }}</span>
                  <span>{{ log.time }}</span>
                </div>
                <pre class="text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded overflow-x-auto">{{ JSON.stringify(log.payload) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
