<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-[60vh] w-full">
    <ProgressSpinner style="width: 4rem; height: 4rem" />
    <p class="mt-4 text-lg font-semibold text-slate-700">Cargando opciones...</p>
  </div>

  <div v-else class="flex flex-col items-center p-4 gap-6">
    <span class="text-2xl font-bold">Elige tu equipo</span>

    <!-- Grid de criaturas disponibles -->
    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="creature in creatures"
        :key="creature.id"
        @click="addToTeam(creature)"
        :class="[
          'bg-white rounded-xl p-4 border w-44 text-center transition-all',
          isCreatureSelected(creature)
            ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
            : 'cursor-pointer hover:bg-blue-50 hover:border-blue-400 border-gray-300',
        ]"
      >
        <img
          v-if="creature.sprite"
          :src="creature.sprite"
          :alt="creature.name"
          class="w-24 h-24 object-contain mx-auto"
        />
        <div class="font-semibold capitalize mt-1 mb-2">{{ creature.name }} Lvl: {{ creature.level }}</div>

        <div class="grid grid-cols-2 gap-x-2 text-xs text-left text-gray-600 mb-2">
          <span>HP</span>      <span class="font-medium text-gray-800">{{ getStat(creature, 'hp') }}</span>
          <span>Ataque</span>  <span class="font-medium text-gray-800">{{ getStat(creature, 'attack') }}</span>
          <span>Defensa</span> <span class="font-medium text-gray-800">{{ getStat(creature, 'defense') }}</span>
          <span>Sp.Atk</span> <span class="font-medium text-gray-800">{{ getStat(creature, 'special-attack') }}</span>
          <span>Sp.Def</span> <span class="font-medium text-gray-800">{{ getStat(creature, 'special-defense') }}</span>
          <span>Vel.</span>    <span class="font-medium text-gray-800">{{ getStat(creature, 'speed') }}</span>
        </div>

        <div class="border-t pt-2 text-xs text-left text-gray-500">
          <p class="font-semibold text-gray-700 mb-1">Ataques</p>
          <ul class="space-y-0.5">
            <li v-for="attack in creature.attacks" :key="attack.name" class="capitalize">
              {{ attack.name }}
              <span v-if="attack.power" class="text-gray-400">· {{ attack.power }}</span>
              <span v-if="attack.type" class="text-gray-400">· {{ attack.type }}</span>
              <span v-if="attack.damageClass" class="text-gray-400">· {{ attack.damageClass }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Panel de equipo seleccionado -->
    <div class="w-full max-w-2xl bg-slate-100 rounded-xl p-4">
      <h2 class="text-lg font-semibold mb-3">
        Tu Equipo
        <span class="text-sm font-normal text-gray-500">({{ team.length }}/3)</span>
      </h2>

      <p v-if="team.length === 0" class="text-center text-gray-400 py-4">
        Ningún Pokémon seleccionado aún.
      </p>

      <div v-else class="grid grid-cols-3 gap-4 mb-4">
        <div
          v-for="(pokemon, index) in team"
          :key="pokemon.id"
          class="bg-white p-3 rounded-lg border border-gray-200 text-center relative"
        >
          <button
            @click="removeFromTeam(index)"
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 text-xs font-bold"
            title="Quitar del equipo"
          >
            ×
          </button>
          <img
            v-if="pokemon.sprite"
            :src="pokemon.sprite"
            :alt="pokemon.name"
            class="w-16 h-16 object-contain mx-auto"
          />
          <div class="font-semibold capitalize text-sm mt-1">{{ pokemon.name }}</div>
          <div class="text-xs text-gray-500 mt-1">HP: {{ pokemon.maxHp }}</div>
          <ul class="mt-2 text-xs text-left text-gray-500 space-y-0.5">
            <li v-for="attack in pokemon.attacks" :key="attack.name" class="capitalize">
              {{ attack.name }}
              <span v-if="attack.power" class="text-gray-400">· {{ attack.power }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="team.length === 3" class="text-center">
        <p class="text-green-600 font-medium mb-3">¡Equipo completo!</p>
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          @click="goToCombat"
        >
          Adentrarse en la torre →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCombatStore } from '@/stores/useCombatStore'
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'
import randomSelection from '@/composables/randomSelection'
import ProgressSpinner from 'primevue/progressspinner'

const creatures = ref([])
const team = ref([])
const loading = ref(true)
const combatStore = useCombatStore()
const towerManager = useTowerManagerStore()

async function loadCreatures() {
  loading.value = true
  creatures.value = await randomSelection()
  loading.value = false
}

function getStat(pokemon, statName) {
  return pokemon.stats?.find((s) => s.stat.name === statName)?.base_stat ?? '-'
}

function isCreatureSelected(creature) {
  return team.value.some((p) => p.id === creature.id)
}

function addToTeam(creature) {
  if (team.value.length >= 3 || isCreatureSelected(creature)) return
  team.value.push(creature)
}

function removeFromTeam(index) {
  team.value.splice(index, 1)
}

async function goToCombat() {
  if (team.value.length !== 3) return

  combatStore.setPlayerTeamFromObjects(team.value)
  towerManager.resetTower()
  towerManager.nextFloor()
}

onMounted(loadCreatures)
</script>