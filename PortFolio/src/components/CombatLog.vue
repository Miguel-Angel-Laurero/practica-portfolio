<template>
  <aside class="combat-log bg-slate-900 text-white rounded-lg p-4 h-48 flex flex-col">
    <h2 class="text-xl font-bold mb-3 shrink-0">Registro</h2>
    <div class="overflow-y-auto flex-1 pr-2">
      <p v-if="logs.length === 0" class="text-sm text-slate-400">Aún no hay acciones registradas.</p>
      <ul v-else class="space-y-2">
        <li v-for="(log, index) in logs" :key="index" class="text-xs leading-5 text-slate-100">
          {{ log }}
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useCombatStore } from '@/stores/useCombatStore'

const combatStore = useCombatStore()
const logs = computed(() => combatStore.logs)
</script>

<style scoped>
.combat-log {
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
}
</style>
