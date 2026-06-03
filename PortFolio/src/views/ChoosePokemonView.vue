<template>
  <div class="flex flex-col items-center min-h-screen bg-indigo-950 text-white p-8 gap-6">
    <h1 class="text-3xl font-bold">Elige un Pokémon</h1>
    <p class="text-gray-400">Selecciona uno de los tres Pokémon disponibles para añadir a tu equipo.</p>

    <!-- Paso 1: elegir pokemon nuevo -->
    <template v-if="!selectedNew">
      <div v-if="loading" class="text-gray-400">Cargando Pokémon...</div>
      <div v-else class="flex flex-wrap justify-center gap-4">
        <div
          v-for="pokemon in options"
          :key="pokemon.id"
          class="bg-white/10 hover:bg-white/20 rounded-xl p-4 w-44 text-center cursor-pointer transition-colors border border-transparent hover:border-yellow-400"
          @click="selectedNew = pokemon"
        >
          <img :src="pokemon.sprite" :alt="pokemon.name" class="w-24 h-24 object-contain mx-auto" />
          <p class="font-bold capitalize mt-2">{{ pokemon.name }}</p>
          <p class="text-xs text-gray-400">Nv. {{ pokemon.level }}</p>

          <div class="grid grid-cols-2 gap-x-2 text-xs text-left text-gray-400 mt-2">
            <span>HP</span>     <span class="text-white">{{ getStat(pokemon, 'hp') }}</span>
            <span>Ataque</span> <span class="text-white">{{ getStat(pokemon, 'attack') }}</span>
            <span>Defensa</span><span class="text-white">{{ getStat(pokemon, 'defense') }}</span>
            <span>Vel.</span>   <span class="text-white">{{ getStat(pokemon, 'speed') }}</span>
          </div>

          <div class="border-t border-white/20 mt-2 pt-2 text-xs text-left">
            <p class="text-gray-400 mb-1">Movimientos</p>
            <ul class="space-y-0.5">
              <li v-for="attack in pokemon.attacks" :key="attack.name" class="capitalize text-gray-300">
                {{ attack.name }}
                <span v-if="attack.power" class="text-gray-500">· {{ attack.power }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <!-- Paso 2: elegir pokemon a sustituir -->
    <template v-else>
      <div class="flex flex-col items-center gap-2 mb-2">
        <p class="text-gray-300">Has elegido:</p>
        <div class="bg-yellow-400 text-indigo-950 rounded-xl p-4 w-44 text-center">
          <img :src="selectedNew.sprite" :alt="selectedNew.name" class="w-20 h-20 object-contain mx-auto" />
          <p class="font-bold capitalize mt-1">{{ selectedNew.name }}</p>
          <p class="text-xs">Nv. {{ selectedNew.level }}</p>
        </div>
      </div>

      <p class="text-gray-300">¿A quién quieres sustituir?</p>

      <div class="flex flex-wrap justify-center gap-4">
        <div
          v-for="(pokemon, index) in combatStore.playerTeam"
          :key="pokemon.id"
          class="bg-white/10 hover:bg-red-400/30 rounded-xl p-4 w-44 text-center cursor-pointer transition-colors border border-transparent hover:border-red-400"
          @click="confirmSwap(index)"
        >
          <img :src="pokemon.sprite" :alt="pokemon.name" class="w-20 h-20 object-contain mx-auto" />
          <p class="font-bold capitalize mt-1">{{ pokemon.name }}</p>
          <p class="text-xs text-gray-400">Nv. {{ pokemon.level }}</p>
          <p class="text-xs text-gray-400 mt-1">HP: {{ pokemon.hp }}/{{ pokemon.maxHp }}</p>
        </div>
      </div>

      <button class="text-gray-400 hover:text-white text-sm mt-2" @click="selectedNew = null">
        ← Volver a elegir Pokémon
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCombatStore } from '@/stores/useCombatStore'
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'
import randomSelection from '@/composables/randomSelection'

const combatStore = useCombatStore()
const towerManager = useTowerManagerStore()

const options = ref([])
const loading = ref(true)
const selectedNew = ref(null)

async function loadOptions() {
  loading.value = true
  const currentNames = combatStore.playerTeam.map((p) => p.name)
  options.value = await randomSelection(3, currentNames)
  loading.value = false
}

function getStat(pokemon, statName) {
  return pokemon.stats?.find((s) => s.stat.name === statName)?.base_stat ?? '-'
}

function confirmSwap(replaceIndex) {
  combatStore.playerTeam.splice(replaceIndex, 1, selectedNew.value)

  // Si el sustituido era el activo, resetear al primero
  if (combatStore.activePlayerIndex === replaceIndex) {
    combatStore.activePlayerIndex = 0
  }

  towerManager.nextFloor()
}

onMounted(loadOptions)
</script>