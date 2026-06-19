<template>
  <div class="flex flex-col h-full">
    <!-- Search -->
    <div class="relative mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索物品 ID 或名称..."
        class="w-full rounded-xl border border-slate-700/60 bg-slate-900/80 px-4 py-2.5 pl-10 text-sm text-slate-200 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 backdrop-blur-xl"
      />
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <span v-if="searchQuery" class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-500">{{ filteredCount }} 项</span>
    </div>

    <!-- Results -->
    <div class="flex-1 overflow-y-auto">
      <template v-if="searchQuery">
        <!-- 搜索模式：扁平列表 -->
        <div v-if="filteredItems.length === 0" class="py-12 text-center text-xs text-slate-600">
          没有找到匹配的物品
        </div>
        <div v-else class="grid grid-cols-1 gap-0.5">
          <button
            v-for="item in filteredItems"
            :key="item.id"
            @click="copyItem(item)"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-800/60"
          >
            <span class="shrink-0 w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs text-slate-400 group-hover:bg-slate-700 transition-colors">
              {{ getCategoryIcon(item.id) }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="font-mono text-[12px] text-cyan-400 group-hover:text-cyan-300">minecraft:{{ item.id }}</div>
              <div class="text-[11px] text-slate-500">{{ item.name }}</div>
            </div>
            <span class="shrink-0 text-[9px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">点击复制</span>
          </button>
        </div>
      </template>

      <template v-else>
        <!-- 分类模式 -->
        <div v-for="cat in itemCategories" :key="cat.key" class="mb-2">
          <button
            @click="toggleCategory(cat.key)"
            class="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-400 transition hover:bg-slate-800/50"
          >
            <span class="transition-transform text-[10px]" :class="{ 'rotate-90': openCategory === cat.key }">▶</span>
            <span class="text-sm">{{ cat.icon }}</span> {{ cat.label }}
            <span class="ml-auto text-[10px] text-slate-600">{{ cat.items.length }}</span>
          </button>

          <div v-show="openCategory === cat.key" class="mt-1 grid grid-cols-1 gap-0.5">
            <button
              v-for="item in cat.items"
              :key="item.id"
              @click="copyItem(item)"
              class="group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition hover:bg-slate-800/60"
            >
              <span class="shrink-0 font-mono text-[12px] text-cyan-400/80 group-hover:text-cyan-300">minecraft:{{ item.id }}</span>
              <span class="truncate text-[11px] text-slate-500 group-hover:text-slate-400">{{ item.name }}</span>
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Copied Toast -->
    <Transition name="toast">
      <div v-if="toast" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur">
        已复制 {{ toast }}
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { itemCategories, allItems, ItemEntry } from '../itemData';

export default defineComponent({
  emits: ['insert-item'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const openCategory = ref<string | null>(null);
    const toast = ref('');

    const filteredItems = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return [];
      return allItems.filter(item =>
        item.id.toLowerCase().includes(q) || item.name.includes(q)
      ).slice(0, 100);
    });

    const filteredCount = computed(() => filteredItems.value.length);

    const toggleCategory = (key: string) => {
      openCategory.value = openCategory.value === key ? null : key;
    };

    const getCategoryIcon = (id: string) => {
      for (const cat of itemCategories) {
        if (cat.items.some(i => i.id === id)) return cat.icon;
      }
      return '📦';
    };

    const copyItem = async (item: ItemEntry) => {
      const fullId = `minecraft:${item.id}`;
      try {
        await navigator.clipboard.writeText(fullId);
        toast.value = fullId;
        setTimeout(() => { toast.value = ''; }, 1500);
      } catch {
        // fallback: emit for command input
        emit('insert-item', fullId);
        toast.value = fullId;
        setTimeout(() => { toast.value = ''; }, 1500);
      }
    };

    return { searchQuery, openCategory, filteredItems, filteredCount, itemCategories, toggleCategory, getCategoryIcon, copyItem, toast };
  },
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
