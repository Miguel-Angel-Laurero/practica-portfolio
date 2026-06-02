<template>
  <div class="flex p-8 gap-8 bg-indigo-950 h-[80vh] justify-between">
    <section class="flex flex-col gap-4">
      <CharacterCard
        v-for="player in playerTeam"
        :key="player.id"
        :name="player.name"
        :hp="player.hp"
        :maxHp="player.maxHp"
        :shield="player.shield"
        :sprite="player.sprite"
        :isPlayer="true"
      />
    </section>

    <section class="flex flex-col gap-4">
      <CharacterCard
        v-for="enemy in enemyTeam"
        :key="enemy.id"
        :name="enemy.name"
        :hp="enemy.hp"
        :maxHp="enemy.maxHp"
        :shield="enemy.shield"
        :sprite="enemy.sprite"
        :isPlayer="false"
      />
    </section>
  </div>
</template>

<script setup>
import CharacterCard from './CharacterCard.vue'
import { useCombatStore } from '@/stores/useCombatStore'
import { storeToRefs } from 'pinia'

const combatStore = useCombatStore()
const { playerTeam, enemyTeam } = storeToRefs(combatStore)
</script>
