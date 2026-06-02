<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-[60vh] w-full">
    <ProgressSpinner style="width: 4rem; height: 4rem" />
    <p class="mt-4 text-lg font-semibold text-slate-700">Cargando opciones...</p>
  </div>

  <div v-else class="flex justify-center p-4 items-center flex-wrap">
    <span class="w-full text-center text-2xl font-bold mb-4">Elige a tu equipo</span>
    <div
      v-for="creature in creatures"
      :key="creature.id"
      @click="addToTeam(creature)"
      :class="[
        'bg-white rounded-xl p-4 m-4 border border-gray-400 w-40 text-center transition-all',
        isCreatureSelected(creature)
          ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
          : 'cursor-pointer hover:bg-blue-100 hover:border-blue-400'
      ]"
    >
      <img v-if="creature.sprite" :src="creature.sprite" :alt="creature.name" class="w-24 h-24 object-contain mx-auto mb-2">
      <div class="font-semibold">{{ creature.name }}</div>
      <div class="text-sm">HP: {{ getStat(creature, 'hp') }}</div>
      <div class="text-sm">Atk: {{ getStat(creature, 'attack') }}</div>
      <div class="text-sm">Def: {{ getStat(creature, 'defense') }}</div>
      <h3>Attacks</h3>
      <ul class="mt-2 text-xs text-left">
        <li v-for="attack in creature.attacks" :key="attack.name">
          {{ attack.name }} - {{ attack.power }}
        </li>
      </ul>
    </div>
    
  </div>
  <div class="mt-6 p-4 bg-slate-100 rounded-lg">
    <h1 class="text-lg font-semibold mb-2">Tu Equipo</h1>
    <div v-if="team.length === 0" class="text-center py-4">Ningún Pokémon seleccionado aún.</div>
    <div v-else class="grid grid-cols-3 gap-4 mb-4">
      <div v-for="(pokemon, index) in team" :key="pokemon.id" class="bg-white p-4 rounded border text-center relative">
        <button
          @click="removeFromTeam(index)"
          class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 font-bold"
          title="Quitar del equipo"
        >
          ×
        </button>
        <img v-if="pokemon.sprite" :src="pokemon.sprite" :alt="pokemon.name" class="w-20 h-20 object-contain mx-auto mb-2">
        <div class="font-semibold">{{ pokemon.name }}</div>
        <div class="text-sm">HP: {{ pokemon.hp }}/{{ pokemon.maxHp }}</div>
        <ul class="mt-2 text-xs text-left">
          <li v-for="attack in pokemon.attacks" :key="attack.name">
            {{ attack.name }} - {{ attack.power }}
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-4" v-if="team.length === 3">
      ¡Equipo completo! Puedes empezar el desafío.
      <button
        class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        @click="goToCombat"
      >
        Adentrarse en la torre
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCombatStore } from '@/stores/useCombatStore'
import randomSelection from '@/composables/randomSelection'
import ProgressSpinner from 'primevue/progressspinner'

const creatures = ref([])
const team = ref([])
const loading = ref(true)
const router = useRouter()
const combatStore = useCombatStore()

async function loadCreatures() {
  loading.value = true
  creatures.value = await randomSelection()
  loading.value = false
}

function getStat(pokemon, statName) {
  return pokemon.stats?.find((stat) => stat.stat.name === statName)?.base_stat ?? '-'
}

function isCreatureSelected(creature) {
  return team.value.some((pokemon) => pokemon.id === creature.id)
}

function addToTeam(selectedCreature) {
  if (team.value.length >= 3) return
  if (team.value.includes(selectedCreature)) return

  team.value.push(selectedCreature)
  console.log(team.value)
}

function removeFromTeam(index) {
  team.value.splice(index, 1)
}

async function goToCombat() {
  if (team.value.length !== 3) return

  const selectedNames = team.value.map((creature) => creature.name)
  const enemyTeam = await randomSelection(3, selectedNames)

  combatStore.setPlayerTeamFromObjects(team.value)
  combatStore.setEnemyTeamFromObjects(enemyTeam)
  combatStore.resetBattle()
  router.push({ name: 'combat' })
}

onMounted(() => {
  loadCreatures()
})
</script>
