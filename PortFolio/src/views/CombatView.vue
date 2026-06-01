<template>
  <main class="view">
    <div class="combat-area">
      <h1 class="sr-only">Combate</h1>
      <Combat />
    </div>
    <ActionMenu />
  </main>
</template>
<script setup>
import Combat from '@/components/CombatArena.vue'
import ActionMenu from '@/components/ActionMenu.vue'
</script>

<style scoped>
.view {
  position: relative;
  min-height: 100vh;
}

.combat-area {
  /* take all available space but leave room for the fixed action menu */
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 88px; /* reserve space equal to action menu height + gap */
}

.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>