<template>
  <div class="command-input-wrapper relative">
    <!-- Suggestion dropdown -->
    <div
      v-if="filteredSuggestions.length > 0 && isFocused"
      class="suggestion-dropdown absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden z-20"
    >
      <div class="px-3 py-1.5 border-b border-slate-700/50">
        <span class="text-[10px] text-slate-500 uppercase tracking-widest">
          {{ suggestionsAreParams ? '参数建议' : '命令建议' }}
        </span>
      </div>
      <div class="max-h-[200px] overflow-y-auto">
        <button
          v-for="(item, idx) in filteredSuggestions"
          :key="item.text"
          type="button"
          @click="selectSuggestion(item)"
          @mouseenter="highlightedIndex = idx"
          :class="[
            'w-full px-3 py-2 text-left flex items-center gap-2.5 transition-colors border-b border-slate-800/50 last:border-0',
            idx === highlightedIndex ? 'bg-cyan-500/10 border-cyan-400/20' : 'hover:bg-slate-800/50'
          ]"
        >
          <!-- Icon -->
          <span
            class="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px]"
            :class="item.type === 'parameter' ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'"
          >
            {{ item.type === 'parameter' ? '¶' : '/' }}
          </span>
          <!-- Content -->
          <div class="min-w-0 flex-1">
            <div class="font-mono text-[12px] text-slate-200">{{ item.text }}</div>
            <div v-if="item.description" class="text-[11px] text-slate-500 truncate mt-0.5">{{ item.description }}</div>
          </div>
          <!-- Keyboard hint on first item -->
          <span v-if="idx === 0" class="shrink-0 text-[9px] text-slate-600 border border-slate-700 rounded px-1 py-0.5">Tab</span>
        </button>
      </div>
    </div>

    <!-- Input bar -->
    <div class="flex gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-2 backdrop-blur-xl shadow-xl shadow-slate-950/20">
      <!-- Prompt -->
      <span class="flex items-center pl-2 font-mono text-sm text-cyan-400 select-none">&gt;</span>

      <!-- Input field -->
      <input
        ref="inputEl"
        v-model="command"
        @keydown="handleKeydown"
        @focus="isFocused = true"
        @blur="onBlur"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        type="text"
        placeholder="输入命令，如 /gamemode creative ..."
        class="flex-1 bg-transparent py-2 text-sm font-mono text-slate-100 outline-none placeholder:text-slate-600"
      />

      <!-- Send button -->
      <button
        @click="doSend"
        class="shrink-0 rounded-xl bg-cyan-500/90 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98]"
      >执行</button>

      <!-- Disconnect -->
      <button
        @click="$emit('disconnect')"
        class="shrink-0 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
      >断开</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue';
import { getAutocompleteSuggestions, CommandEntry } from '../commandData';

interface SuggestionItem {
  type: 'command' | 'parameter';
  text: string;
  description?: string;
}

export default defineComponent({
  props: {
    commands: { type: Array as PropType<CommandEntry[]>, default: () => [] },
  },
  emits: ['send', 'disconnect'],
  setup(props, { emit }) {
    const command = ref('');
    const highlightedIndex = ref(0);
    const isFocused = ref(false);
    const inputEl = ref<HTMLInputElement | null>(null);

    const filteredSuggestions = computed<SuggestionItem[]>(() => {
      const val = command.value;
      if (!val || !val.startsWith('/')) return [];
      const results = getAutocompleteSuggestions(val);
      return results.slice(0, 8);
    });

    const suggestionsAreParams = computed(() => {
      return filteredSuggestions.value.length > 0 && filteredSuggestions.value[0].type === 'parameter';
    });

    const selectSuggestion = (item: SuggestionItem) => {
      const val = command.value;
      if (item.type === 'command') {
        // 替换整个命令名
        command.value = item.text + ' ';
      } else {
        // 追加参数，替换最后一个部分
        const parts = val.split(/\s+/);
        if (parts.length > 1) {
          parts[parts.length - 1] = item.text;
          command.value = parts.join(' ') + ' ';
        } else {
          command.value = val + item.text + ' ';
        }
      }
      highlightedIndex.value = 0;
      inputEl.value?.focus();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      const max = filteredSuggestions.value.length;
      if (max === 0) {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSend();
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightedIndex.value = (highlightedIndex.value + 1) % max;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightedIndex.value = (highlightedIndex.value - 1 + max) % max;
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const idx = highlightedIndex.value;
        if (idx >= 0 && idx < max) {
          selectSuggestion(filteredSuggestions.value[idx]);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        doSend();
      }
    };

    const onBlur = () => {
      // 延迟关闭以允许点击建议
      setTimeout(() => { isFocused.value = false; }, 150);
    };

    const doSend = () => {
      const val = command.value.trim();
      if (!val) return;
      emit('send', val);
      command.value = '';
      highlightedIndex.value = 0;
    };

    const insertCommand = (cmd: string) => {
      command.value = cmd + ' ';
      inputEl.value?.focus();
      isFocused.value = true;
    };

    return {
      command,
      highlightedIndex,
      isFocused,
      filteredSuggestions,
      suggestionsAreParams,
      selectSuggestion,
      handleKeydown,
      onBlur,
      doSend,
      insertCommand,
      inputEl,
    };
  },
});
</script>

<style scoped>
.suggestion-dropdown::-webkit-scrollbar {
  width: 5px;
}
.suggestion-dropdown::-webkit-scrollbar-track {
  background: transparent;
}
.suggestion-dropdown::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.15);
  border-radius: 3px;
}
</style>
