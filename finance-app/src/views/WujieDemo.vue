<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Send, Radio, ShieldCheck, BellRing } from '@lucide/vue'

const isWujie = ref(!!window.__POWERED_BY_WUJIE__)
const propsReceived = ref<any>(window.$wujie?.props || { note: '当前为独立运行，暂无基座传递 Props' })
const customMessage = ref('财务中心重要提醒：第 3 季度企业所得税申报完成，资金账户准备完毕。')
const receivedLogs = ref<Array<{ time: string; event: string; payload: any }>>([])

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

const emitToMain = () => {
  if (!customMessage.value.trim()) return

  if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('finance:notify', {
      type: 'warning',
      title: '来自财务中心的重要事件',
      content: customMessage.value,
      time: new Date().toLocaleTimeString(),
    })
  } else {
    alert('当前非微前端环境，无法通过 Wujie Bus 发送消息给基座')
  }
}

const jumpToOps = () => {
  if (window.$wujie?.props?.jump) {
    window.$wujie.props.jump('/ops')
  } else if (window.$wujie?.bus) {
    window.$wujie.bus.$emit('main:navigate', '/ops')
  } else {
    window.location.href = 'http://localhost:5101'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
          <Radio class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800">财务中心 • 微前端通信与环境探测</h2>
          <p class="text-sm text-slate-500 mt-0.5">测试基座与财务系统之间的数据透传、安全沙箱机制与跨系统联动</p>
        </div>
      </div>
    </div>

    <!-- 运行环境状态 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 class="font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-emerald-600" />
          财务沙箱运行隔离度检测
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
            <span class="font-mono text-xs font-semibold text-emerald-600">5102</span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">基座注入的 Props 上下文</h4>
          <pre class="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">{{ JSON.stringify(propsReceived, null, 2) }}</pre>
        </div>

        <div class="pt-2">
          <button
            @click="jumpToOps"
            class="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>调用基座路由切换：直接跳转到【运营中心】</span>
          </button>
        </div>
      </div>

      <!-- 发送消息与总线监听 -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
        <div class="space-y-4">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <BellRing class="w-4 h-4 text-emerald-600" />
            跨应用事件总线通信 (Bus Emit)
          </h3>

          <div class="space-y-2">
            <label class="block text-xs font-medium text-slate-600">向基座发送财务预警通知</label>
            <div class="flex gap-2">
              <input
                v-model="customMessage"
                type="text"
                class="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                @click="emitToMain"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send class="w-3.5 h-3.5" />
                <span>触发 Emit</span>
              </button>
            </div>
            <p class="text-xs text-slate-400">基座将通过全局 Bus 捕获，并写入事件流水与通知栏</p>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">收到的基座广播事件 (实时)</h4>
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
                  <span class="font-semibold text-emerald-600">{{ log.event }}</span>
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
