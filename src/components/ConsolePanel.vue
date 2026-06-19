<template>
  <div class="console-panel flex flex-col rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-slate-950/20 h-full">
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/40">
      <h2 class="flex items-center gap-2 text-base font-semibold text-slate-100">
        <span class="text-cyan-400">▸</span> 控制台
      </h2>
      <div class="flex items-center gap-2">
        <span class="text-[11px] text-slate-500">{{ logs.length }} 条记录</span>
        <button
          @click="$emit('clear')"
          class="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
        >清空</button>
        <button
          @click="$emit('refresh')"
          class="rounded-lg bg-cyan-500/10 px-2.5 py-1 text-[11px] text-cyan-400 transition hover:bg-cyan-500/20"
        >刷新</button>
      </div>
    </div>

    <div
      ref="consoleBody"
      class="console-body flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
    >
      <div v-if="logs.length === 0" class="flex h-full items-center justify-center text-slate-600">
        <div class="text-center">
          <div class="text-4xl mb-2">▸</div>
          <p class="text-xs">等待命令输出...</p>
        </div>
      </div>

      <div v-for="(item, index) in logs" :key="index" class="console-line group">
        <span class="select-none text-[10px] text-slate-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">{{ item.time }}</span>
        <span v-if="item.type === 'send'" class="text-amber-400/90">&gt; </span>
        <span v-if="item.type === 'error'" class="text-rose-400/90">✕ </span>
        <span :class="lineClass(item)">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, nextTick } from 'vue';

export interface LogEntry {
  text: string;
  type: 'send' | 'receive' | 'info' | 'error';
  time: string;
}

export default defineComponent({
  props: {
    logs: { type: Array as PropType<LogEntry[]>, required: true },
  },
  emits: ['refresh', 'clear'],
  setup(props) {
    const consoleBody = ref<HTMLElement | null>(null);

    watch(
      () => props.logs.length,
      () => {
        nextTick(() => {
          if (consoleBody.value) {
            consoleBody.value.scrollTop = consoleBody.value.scrollHeight;
          }
        });
      }
    );

    const lineClass = (item: LogEntry) => ({
      'text-amber-300': item.type === 'send',
      'text-slate-300': item.type === 'receive',
      'text-slate-400': item.type === 'info',
      'text-rose-300': item.type === 'error',
    });

    return { consoleBody, lineClass };
  },
});
</script>

<style scoped>
.console-body {
  background: linear-gradient(
    180deg,
    rgba(2, 6, 23, 0.95) 0%,
    rgba(2, 6, 23, 0.85) 100%
  );
  scroll-behavior: smooth;
}

.console-body::-webkit-scrollbar {
  width: 6px;
}
.console-body::-webkit-scrollbar-track {
  background: transparent;
}
.console-body::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.15);
  border-radius: 3px;
}
.console-body::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.3);
}

.console-line {
  padding: 1px 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
