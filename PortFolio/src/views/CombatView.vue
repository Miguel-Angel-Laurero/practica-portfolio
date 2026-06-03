<template>
  <main class="flex flex-col h-screen">
    <div class="flex-1 overflow-hidden">
      <Combat />
    </div>
    <section class="grid grid-cols-2 gap-4 p-4 bg-slate-800">
      <ActionMenu />
      <CombatLog />
    </section>
  </main>
</template>
<script setup>
  import Combat from '@/components/CombatArena.vue'
  import ActionMenu from '@/components/ActionMenu.vue'
  import CombatLog from '@/components/CombatLog.vue'
</script>
