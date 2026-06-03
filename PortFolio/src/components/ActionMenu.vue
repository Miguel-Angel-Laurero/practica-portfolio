<template>
  <div class="grid grid-cols-2 gap-2 p-2 bg-gray-100 rounded-lg overflow-y-auto">
    <template v-if="actionMenuStore.currentMenu === 'main'">
      <button class="action-btn hover:bg-blue-50" @click="actionMenuStore.openMenu('attack')">Atacar</button>
      <button class="action-btn hover:bg-blue-50" @click="actionMenuStore.openMenu('switch')">Cambiar</button>
      <button class="action-btn hover:bg-blue-50" @click="actionMenuStore.openMenu('items')">Items</button>
      <button class="action-btn hover:bg-blue-50" @click="executeAction('flee')">Huir</button>
    </template>

    <template v-else-if="actionMenuStore.currentMenu === 'attack'">
      <button
        v-for="attack in activePlayerAttacks"
        :key="attack.name"
        class="action-btn flex flex-col items-start m-4 p-4 bg-gray-50  hover:bg-blue-50" 
        @click="executeAction('skill', attack)"
      >
        <span class="font-bold capitalize">{{ attack.name }}</span>
        <span class="text-xs text-gray-500">Poder: {{ attack.power ?? '—' }}</span>
      </button>
      <span v-if="activePlayerAttacks.length === 0" class="col-span-2 text-center text-gray-400 py-2">
        Sin ataques
      </span>
      <button class="action-btn col-span-2" @click="actionMenuStore.backToMain()">← Volver</button>
    </template>

    <template v-else-if="actionMenuStore.currentMenu === 'switch'">
      <button
        v-for="(player, index) in switchablePlayers"
        :key="player.id"
        class="action-btn flex flex-col items-start"
        @click="executeSwitch(index)"
      >
        <span class="font-bold">{{ player.name }}</span>
        <span class="text-xs text-gray-500">HP: {{ player.hp }}/{{ player.maxHp }}</span>
      </button>
      <span v-if="switchablePlayers.length === 0" class="col-span-2 text-center text-gray-400 py-2">
        Sin pokémon disponibles
      </span>
      <button class="action-btn col-span-2" @click="actionMenuStore.backToMain()">← Volver</button>
    </template>

    <template v-else-if="actionMenuStore.currentMenu === 'items'">
      <button class="action-btn" @click="executeAction('items')">Usar item</button>
      <button class="action-btn col-span-2" @click="actionMenuStore.backToMain()">← Volver</button>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCombatStore } from '@/stores/useCombatStore'
import { useActionMenuStore } from '@/stores/useActionMenuStore'
import { storeToRefs } from 'pinia'

const combatStore = useCombatStore()
const actionMenuStore = useActionMenuStore()

const { activePlayer, activePlayerIndex, playerTeam } = storeToRefs(combatStore)

const activePlayerAttacks = computed(() => activePlayer.value?.attacks ?? [])

const switchablePlayers = computed(() =>
  playerTeam.value.filter((p, i) => i !== activePlayerIndex.value && p.hp > 0)
)

const executeAction = (actionType, attack = null) => {
  combatStore.executePlayerAction(actionType, attack)
  actionMenuStore.backToMain()
}

const executeSwitch = (index) => {
  combatStore.switchActivePokemon(index)
  actionMenuStore.backToMain()
}
</script>