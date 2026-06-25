<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="command" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content rounded-2xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl max-w-lg w-full mx-4">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-mono text-xl font-bold text-slate-100">{{ command.name }}</h3>
                <span
                  class="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  :class="permissionBadgeClass"
                >{{ t('cmdDetail.permission') }} {{ command.permission }}</span>
              </div>
              <p v-if="command.note" class="mt-1.5 text-[11px] text-amber-400/80">⚠ {{ locale.current === 'en' ? (command.noteEn || command.note) : command.note }}</p>
            </div>
            <button @click="$emit('close')" class="shrink-0 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Description -->
          <div class="mt-5 space-y-4">
            <div v-if="command.syntax">
              <p class="text-[11px] font-medium uppercase tracking-widest text-slate-500">{{ t('cmdDetail.syntax') }}</p>
              <div class="mt-1.5 rounded-xl bg-slate-950/80 px-3.5 py-2.5 border border-slate-700/50">
                <code class="font-mono text-[13px] text-cyan-300 break-all">{{ command.syntax }}</code>
              </div>
            </div>

            <div v-if="command.aliases && command.aliases.length">
              <p class="text-[11px] font-medium uppercase tracking-widest text-slate-500">{{ t('cmdDetail.aliases') }}</p>
              <div class="mt-1.5 flex flex-wrap gap-1.5">
                <span
                  v-for="alias in command.aliases"
                  :key="alias"
                  class="rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-[12px] text-slate-300"
                >{{ alias }}</span>
              </div>
            </div>

            <div v-if="command.parameters && command.parameters.length">
              <p class="text-[11px] font-medium uppercase tracking-widest text-slate-500">{{ t('cmdDetail.params') }}</p>
              <div class="mt-1.5 space-y-1">
                <div
                  v-for="(param, idx) in command.parameters"
                  :key="idx"
                  class="flex items-center gap-2 rounded-lg bg-slate-950/60 px-3 py-1.5 text-xs"
                >
                  <span class="font-mono text-cyan-400">{{ param.name }}</span>
                  <span v-if="param.optional" class="text-slate-600">{{ t('cmdDetail.optional') }}</span>
                  <span class="text-slate-500">· {{ param.type }}</span>
                  <span v-if="param.choices" class="ml-auto text-[11px] text-slate-500">{{ param.choices.slice(0, 6).join(' | ') }}{{ param.choices.length > 6 ? ' ...' : '' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex gap-3">
            <button
              @click="$emit('insert', command.name)"
              class="flex-1 rounded-xl bg-cyan-500/90 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98]"
            >{{ t('cmdDetail.insert') }}</button>
            <button
              @click="$emit('close')"
              class="rounded-xl bg-slate-800 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
            >{{ t('cmdDetail.close') }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import type { CommandEntry } from '../data/commandData';
import { t, locale } from '../i18n';

export default defineComponent({
  props: {
    command: { type: Object as PropType<CommandEntry | null>, default: null },
  },
  emits: ['close', 'insert'],
  setup(props) {
    const permissionBadgeClass = computed(() => {
      const p = props.command?.permission ?? 0;
      if (p === 0) return 'bg-slate-700 text-slate-300';
      if (p <= 2) return 'bg-cyan-500/15 text-cyan-400';
      if (p === 3) return 'bg-amber-500/15 text-amber-400';
      return 'bg-rose-500/15 text-rose-400';
    });
    return { permissionBadgeClass, t, locale };
  },
});
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); padding: 1rem; }
.modal-content { max-height: 90vh; overflow-y: auto; }
.modal-content::-webkit-scrollbar { width: 6px; }
.modal-content::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.2); border-radius: 3px; }
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.95) translateY(8px); }
</style>
