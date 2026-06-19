<template>
  <div class="info-panel rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl shadow-slate-950/20">
    <h2 class="flex items-center gap-2 text-base font-semibold text-slate-100">
      <span class="text-cyan-400">🖥</span> 服务器信息
      <span class="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        在线
      </span>
    </h2>

    <div class="mt-4 space-y-3">
      <!-- 玩家数 -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400">在线玩家</span>
          <span class="font-mono text-slate-200">
            <span class="text-cyan-400">{{ info.players?.total ?? 0 }}</span>
            <span class="text-slate-500"> / {{ info.players?.max ?? '?' }}</span>
          </span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-700"
            :style="{ width: playerPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- 版本 -->
      <div class="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2 text-xs">
        <span class="text-slate-400">版本</span>
        <span class="font-mono text-slate-200">{{ info.version || '未知' }}</span>
      </div>

      <!-- TPS（如果可用） -->
      <div v-if="info.tps" class="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2 text-xs">
        <span class="text-slate-400">TPS</span>
        <span class="font-mono" :class="tpsColorClass">{{ info.tps }}</span>
      </div>

      <!-- MSPT（如果可用） -->
      <div v-if="info.mspt" class="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2 text-xs">
        <span class="text-slate-400">MSPT</span>
        <span class="font-mono" :class="msptColorClass">{{ info.mspt }}ms</span>
      </div>

      <!-- Mods（如果可用） -->
      <div v-if="info.mods && info.mods.length > 0" class="mt-3 border-t border-slate-700/50 pt-3">
        <span class="text-xs font-medium text-slate-400">已加载 Mod ({{ info.mods.length }})</span>
        <div class="mt-2 flex max-h-[100px] flex-wrap gap-1.5 overflow-y-auto pr-1">
          <span
            v-for="mod in info.mods"
            :key="mod"
            class="inline-block rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 transition-colors"
          >{{ mod }}</span>
        </div>
      </div>
      <div v-else-if="info.mods !== undefined && info.mods.length === 0" class="mt-3 border-t border-slate-700/50 pt-3">
        <span class="text-xs text-slate-500">未检测到 Mod</span>
      </div>

      <!-- 在线玩家列表 -->
      <div v-if="info.players?.names?.length" class="mt-3 border-t border-slate-700/50 pt-3">
        <span class="text-xs font-medium text-slate-400">玩家列表</span>
        <div class="mt-2 flex max-h-[120px] flex-wrap gap-1.5 overflow-y-auto pr-1">
          <span
            v-for="name in info.players.names"
            :key="name"
            class="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] text-slate-200"
          >
            <span class="text-[10px]">🧑</span> {{ name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

interface PlayerInfo {
  total: number;
  max: number;
  names: string[];
}

interface ServerInfo {
  host?: string;
  port?: number;
  version?: string;
  players?: PlayerInfo;
  tps?: string;
  mspt?: string;
  mods?: string[];
}

export default defineComponent({
  props: {
    info: { type: Object as PropType<ServerInfo>, required: true },
  },
  setup(props) {
    const playerPercentage = computed(() => {
      const p = props.info.players;
      if (!p || p.max === 0) return 0;
      return Math.min(100, Math.round((p.total / p.max) * 100));
    });

    const tpsColorClass = computed(() => {
      const tps = props.info.tps;
      if (!tps) return 'text-slate-400';
      const val = parseFloat(tps);
      if (val >= 19) return 'text-emerald-400';
      if (val >= 15) return 'text-amber-400';
      return 'text-rose-400';
    });

    const msptColorClass = computed(() => {
      const mspt = props.info.mspt;
      if (!mspt) return 'text-slate-400';
      const val = parseFloat(mspt);
      if (val < 40) return 'text-emerald-400';
      if (val < 50) return 'text-amber-400';
      return 'text-rose-400';
    });

    return { playerPercentage, tpsColorClass, msptColorClass };
  },
});
</script>
