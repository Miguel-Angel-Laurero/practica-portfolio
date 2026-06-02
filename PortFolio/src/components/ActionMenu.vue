<template>
  <div class="action-menu">
    <template v-if="actionMenuStore.currentMenu === 'main'">
      <button class="item cursor-pointer" @click="actionMenuStore.openMenu('attack')">Atacar</button>
      <button class="item" @click="executeAction('defend')">Defender</button>
      <button class="item" @click="actionMenuStore.openMenu('items')">Items</button>
      <button class="item" @click="executeAction('flee')">Huir</button>
    </template>

    <template v-else-if="actionMenuStore.currentMenu === 'attack'">
      <button class="item" @click="executeAction('skill-1')">Hab.1</button>
      <button class="item" @click="executeAction('skill-2')">Hab.2</button>
      <button class="item" @click="executeAction('skill-3')">Hab.3</button>
      <button class="item" @click="executeAction('skill-4')">Hab.4</button>
      <button class="item" @click="actionMenuStore.backToMain()">Volver</button>
    </template>

    <template v-else-if="actionMenuStore.currentMenu === 'items'">
      <button class="item" @click="executeAction('items')">Usar item</button>
      <button class="item" @click="actionMenuStore.backToMain()">Volver</button>
    </template>
  </div>
</template>
<script setup>
import { useCombatStore } from '@/stores/useCombatStore'
import { useActionMenuStore } from '@/stores/useActionMenuStore'

const combatStore = useCombatStore()
const actionMenuStore = useActionMenuStore()

const executeAction = (actionType) => {
  combatStore.executePlayerAction(actionType)
  actionMenuStore.backToMain()
}
</script>

<style scoped>
.action-menu {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  gap: 8px;
  padding: 8px;
  box-sizing: border-box;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
}
.action-menu .item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-weight: 600;
}
.action-menu .item:hover {
  background: lightblue;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-weight: 600;
}
</style>
