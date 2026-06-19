<template>
  <div class="app-background min-h-screen text-slate-100">
    <div class="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-4 py-4 lg:px-6">
      <!-- ── Header / Nav ── -->
      <header v-if="connected" class="rounded-2xl border border-slate-700/60 bg-slate-900/70 px-5 py-2.5 backdrop-blur-xl shadow-xl shadow-slate-950/20">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-lg">
              🧊
            </div>
            <nav class="flex items-center gap-1">
              <button
                @click="activeTab = 'console'"
                :class="[
                  'rounded-xl px-3.5 py-1.5 text-sm font-medium transition',
                  activeTab === 'console'
                    ? 'bg-cyan-500/15 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                ]"
              >▸ 控制台</button>
              <button
                @click="activeTab = 'items'"
                :class="[
                  'rounded-xl px-3.5 py-1.5 text-sm font-medium transition',
                  activeTab === 'items'
                    ? 'bg-cyan-500/15 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                ]"
              >📦 物品栏</button>
            </nav>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[11px] text-slate-500">{{ info.host }}:{{ info.port }}</span>
            <span class="text-emerald-400 text-[11px]">● 在线</span>
          </div>
        </div>
      </header>

      <!-- ── Login Screen ── -->
      <section v-if="!connected" class="login-screen grid min-h-[calc(100vh-100px)] place-items-center px-4 py-6">
        <div class="w-full max-w-xl space-y-6">
          <div class="text-center mb-4">
            <div class="text-5xl mb-4">🧊</div>
            <h2 class="text-3xl font-bold text-slate-100">Minecraft RCON</h2>
            <p class="mt-2 text-slate-400">远程服务器管理控制台</p>
          </div>
          <div class="glass-card rounded-3xl p-8 shadow-2xl shadow-slate-950/30">
            <form @submit.prevent="login" class="space-y-5">
              <label class="block text-sm text-slate-300">
                <span class="font-medium">服务器地址</span>
                <input v-model="host" type="text" placeholder="localhost" class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" required />
              </label>
              <label class="block text-sm text-slate-300">
                <span class="font-medium">RCON 端口</span>
                <input v-model.number="port" type="number" placeholder="25575" class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" required />
              </label>
              <label class="block text-sm text-slate-300">
                <span class="font-medium">RCON 密码</span>
                <input v-model="password" type="password" placeholder="请输入 RCON 密码" class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" required />
              </label>
              <button class="w-full rounded-xl bg-cyan-500/90 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.99]">连接服务器</button>
            </form>
            <p v-if="message" class="mt-4 rounded-xl px-4 py-3 text-sm" :class="messageType === 'error' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'">{{ message }}</p>
          </div>
        </div>
      </section>

      <!-- ── Console Tab ── -->
      <template v-if="connected && activeTab === 'console'">
        <div class="grid flex-1 gap-4 lg:grid-cols-[260px_1fr_300px]">
          <div class="flex flex-col gap-4">
            <ServerInfoPanel :info="info" />
          </div>
          <ConsolePanel :logs="logs" @refresh="refreshInfo" @clear="logs = []" />
          <CommandLibrary @select-command="openCommandDetail" />
        </div>
        <div class="sticky bottom-0 pb-2">
          <CommandInput ref="commandInputRef" :commands="commandItems" @send="sendCommand" @disconnect="disconnect" />
        </div>
        <CommandDetailModal :command="detailCommand" @close="detailCommand = null" @insert="insertCommand" />
      </template>

      <!-- ── Items Tab ── -->
      <template v-if="connected && activeTab === 'items'">
        <div class="flex-1 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl shadow-slate-950/20">
          <ItemLibrary @insert-item="insertItem" />
        </div>
        <div class="sticky bottom-0 pb-2">
          <CommandInput ref="commandInputRef" :commands="commandItems" @send="sendCommand" @disconnect="disconnect" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { commandData, CommandEntry } from './commandData';
import ServerInfoPanel from './components/ServerInfoPanel.vue';
import ConsolePanel from './components/ConsolePanel.vue';
import type { LogEntry } from './components/ConsolePanel.vue';
import CommandLibrary from './components/CommandLibrary.vue';
import CommandDetailModal from './components/CommandDetailModal.vue';
import CommandInput from './components/CommandInput.vue';
import ItemLibrary from './components/ItemLibrary.vue';

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

export default {
  components: { ServerInfoPanel, ConsolePanel, CommandLibrary, CommandDetailModal, CommandInput, ItemLibrary },
  setup() {
    const connected = ref(false);
    const host = ref('localhost');
    const port = ref(25575);
    const password = ref('');
    const message = ref('');
    const messageType = ref<'info' | 'error'>('info');
    const logs = ref<LogEntry[]>([]);
    const info = ref<ServerInfo>({});
    const detailCommand = ref<CommandEntry | null>(null);
    const commandInputRef = ref<InstanceType<typeof CommandInput> | null>(null);
    const activeTab = ref<'console' | 'items'>('console');
    const refreshInterval = 15;
    let intervalId: number | null = null;

    const commandItems = commandData.map(entry => ({
      ...entry,
      name: entry.name.replace(/^\//, '').trim(),
      aliases: entry.aliases?.map(a => a.replace(/^\//, '').trim()),
    }));

    const timeStr = () => {
      const d = new Date();
      return d.getHours().toString().padStart(2, '0') + ':' +
             d.getMinutes().toString().padStart(2, '0') + ':' +
             d.getSeconds().toString().padStart(2, '0');
    };

    const addLog = (text: string, type: LogEntry['type'] = 'info') => {
      logs.value.push({ text, type, time: timeStr() });
      if (logs.value.length > 200) logs.value.shift();
    };

    const request = async (path: string, options: RequestInit = {}) => {
      const response = await fetch(path, options);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || response.statusText || '请求失败');
      }
      return response.json();
    };

    const login = async () => {
      message.value = '';
      try {
        const result = await request('/api/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ host: host.value, port: port.value, password: password.value }),
        });
        connected.value = true;
        info.value = { host: host.value, port: port.value };
        addLog(`✓ 已连接到 ${host.value}:${port.value}`, 'info');
        message.value = '连接成功';
        messageType.value = 'info';
        await refreshInfo();
        if (!intervalId) {
          intervalId = window.setInterval(refreshInfo, refreshInterval * 1000);
        }
      } catch (error) {
        message.value = (error as Error).message;
        messageType.value = 'error';
        addLog(`✕ 连接失败: ${message.value}`, 'error');
      }
    };

    const refreshInfo = async () => {
      if (!connected.value) return;
      try {
        const result = await request('/api/server-info');
        info.value = {
          ...info.value,
          version: result.version,
          players: result.players,
          tps: result.tps,
          mspt: result.mspt,
          mods: result.mods,
        };
      } catch (error) {
        addLog(`刷新失败: ${(error as Error).message}`, 'error');
      }
    };

    const sendCommand = async (raw: string) => {
      const cmd = raw.trim().replace(/^\/+/, '');
      if (!cmd) return;
      try {
        const result = await request('/api/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: cmd }),
        });
        addLog(raw, 'send');
        const response = String(result.response || '');
        if (response) addLog(response, 'receive');
        else addLog('(服务器返回空响应)', 'info');
      } catch (error) {
        addLog(`命令执行失败: ${(error as Error).message}`, 'error');
      }
    };

    const disconnect = async () => {
      try {
        await request('/api/disconnect', { method: 'POST' });
        connected.value = false;
        addLog('已断开 RCON 连接', 'info');
        info.value = {};
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (error) {
        addLog(`断开失败: ${(error as Error).message}`, 'error');
      }
    };

    const openCommandDetail = (cmd: CommandEntry) => {
      detailCommand.value = cmd;
    };

    const insertCommand = (cmdName: string) => {
      const inputComp = commandInputRef.value as any;
      if (inputComp && inputComp.insertCommand) {
        inputComp.insertCommand(cmdName);
      }
      detailCommand.value = null;
    };

    const insertItem = (itemId: string) => {
      const inputComp = commandInputRef.value as any;
      if (inputComp && inputComp.insertCommand) {
        inputComp.insertCommand(itemId);
      }
    };

    return {
      connected, host, port, password, message, messageType,
      logs, info, detailCommand, commandInputRef, commandItems, activeTab, refreshInterval,
      login, refreshInfo, sendCommand, disconnect,
      openCommandDetail, insertCommand, insertItem,
    };
  },
};
</script>
