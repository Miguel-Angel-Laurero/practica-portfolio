<template>
  <div class="flex flex-col items-center min-h-screen bg-indigo-950 text-white p-8 gap-6">
    <h1 class="text-3xl font-bold">Entrenamiento</h1>

    <template v-if="!mode">
      <p class="text-gray-300">¿Qué tipo de entrenamiento quieres?</p>
      <div class="flex gap-4 mt-4">
        <button class="train-btn" @click="mode = 'levelup'">⬆️ Subir nivel a todos</button>
        <button class="train-btn" @click="mode = 'moves'">🔄 Cambiar movimientos</button>
      </div>
    </template>

    <template v-else-if="mode === 'levelup'">
      <p class="text-gray-300">Todo tu equipo subirá un nivel.</p>
      <div class="flex flex-col gap-3 w-full max-w-md">
        <div
          v-for="pokemon in combatStore.playerTeam"
          :key="pokemon.id"
          class="bg-white/10 rounded-xl p-4 flex items-center gap-4"
        >
          <img :src="pokemon.sprite" :alt="pokemon.name" class="w-16 h-16 object-contain" />
          <div>
            <p class="font-bold capitalize">{{ pokemon.name }}</p>
            <p class="text-sm text-gray-400">Nv. {{ pokemon.level }} → {{ pokemon.level + 1 }}</p>
          </div>
        </div>
      </div>
      <button 
        class="train-btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed" 
        :disabled="isSubmitting"
        @click="applyLevelUp"
      >
        {{ isSubmitting ? 'Subiendo nivel...' : 'Confirmar' }}
      </button>
    </template>

    <template v-else-if="mode === 'moves'">
      <p class="text-gray-300 mb-2">Elige un nuevo movimiento para los Pokémon que quieras (Opcional).</p>

      <div v-if="loadingMoves" class="text-gray-400">Cargando movimientos...</div>

      <div v-else class="flex flex-col gap-6 w-full max-w-2xl">
        <div
          v-for="(pokemon, pIndex) in combatStore.playerTeam"
          :key="pokemon.id"
          class="bg-white/10 rounded-xl p-4"
        >
          <div class="flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <img :src="pokemon.sprite" :alt="pokemon.name" class="w-12 h-12 object-contain" />
              <p class="font-bold capitalize">{{ pokemon.name }}</p>
            </div>
            <button 
              v-if="selectedNewMove[pIndex]" 
              @click="clearPokemonSelection(pIndex)"
              class="text-xs text-red-400 hover:underline"
            >
              No cambiar nada
            </button>
          </div>

          <div class="flex flex-col gap-2 mb-3">
            <p class="text-xs text-gray-400 mb-1">Elige un movimiento nuevo:</p>
            <button
              v-for="move in newMoves[pIndex]"
              :key="move.name"
              class="text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors"
              :class="selectedNewMove[pIndex]?.name === move.name ? 'bg-yellow-400 text-indigo-950 font-bold' : 'bg-white/10 hover:bg-white/20'"
              @click="selectedNewMove[pIndex] = move"
            >
              {{ move.name }}
              <span class="text-xs opacity-70">· {{ move.power ?? '—' }} · {{ move.type }}</span>
            </button>
          </div>

          <div v-if="selectedNewMove[pIndex]">
            <p class="text-xs text-gray-400 mb-1">¿Qué movimiento reemplazar? <span class="text-red-400">*</span></p>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="(attack, aIndex) in pokemon.attacks"
                :key="attack.name"
                class="px-3 py-1 rounded-lg text-sm capitalize transition-colors"
                :class="selectedReplaceIndex[pIndex] === aIndex ? 'bg-red-400 text-white font-bold' : 'bg-white/10 hover:bg-white/20'"
                @click="selectedReplaceIndex[pIndex] = aIndex"
              >
                {{ attack.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        class="train-btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canSubmitMoves || isSubmitting"
        @click="applyMoveChanges"
      >
        {{ isSubmitting ? 'Guardando...' : 'Confirmar cambios' }}
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCombatStore } from '@/stores/useCombatStore'
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'

const combatStore = useCombatStore()
const towerManager = useTowerManagerStore()

const mode = ref(null)
const loadingMoves = ref(false)
const isSubmitting = ref(false) // Controla el bloqueo de los botones de confirmación
const newMoves = ref([]) 
const selectedNewMove = ref([])
const selectedReplaceIndex = ref([])

// LÓGICA OPCIONAL: El usuario puede confirmar si para cada pokémon se cumple:
// O bien NO ha elegido ningún movimiento nuevo, 
// O bien si eligió uno, también ha seleccionado el índice del ataque a reemplazar.
const canSubmitMoves = computed(() =>
  combatStore.playerTeam.every((_, i) => {
    const hasNew = !!selectedNewMove.value[i]
    const hasReplace = selectedReplaceIndex.value[i] !== undefined
    return !hasNew || (hasNew && hasReplace)
  })
)

async function fetchNewMovesForTeam() {
  loadingMoves.value = true
  newMoves.value = await Promise.all(
    combatStore.playerTeam.map(async (pokemon) => {
      const currentNames = pokemon.attacks.map((a) => a.name)
      const allMoves = pokemon.learnableMoves ?? []
      const available = allMoves.filter((m) => !currentNames.includes(m.name))
      const shuffled = available.sort(() => Math.random() - 0.5).slice(0, 3)

      return Promise.all(
        shuffled.map(async (m) => {
          try {
            const res = await fetch(m.url)
            const data = await res.json()
            return {
              name: m.name,
              power: data.power ?? 0,
              type: data.type?.name ?? 'normal',
              damageClass: data.damage_class?.name ?? 'physical',
              effects: data.effect_entries || [],
            }
          } catch {
            return { name: m.name, power: 0, type: 'normal', damageClass: 'physical', effects: [] }
          }
        }),
      )
    }),
  )
  loadingMoves.value = false
}

// Resetea la selección de un Pokémon específico
function clearPokemonSelection(index) {
  selectedNewMove.value[index] = null
  selectedReplaceIndex.value[index] = undefined
}

// Bloqueo añadido al subir de nivel
async function applyLevelUp() {
  isSubmitting.value = true
  try {
    combatStore.playerTeam.forEach((pokemon) => combatStore.levelUp(pokemon))
    // Añadimos un micro-delay por UX antes de pasar de piso, o por si necesitas async en el store
    await new Promise(resolve => setTimeout(resolve, 300))
    towerManager.nextFloor()
  } catch (error) {
    console.error(error)
    isSubmitting.value = false
  }
}

// Guardado de movimientos (solo para los que el usuario sí eligió cambios)
async function applyMoveChanges() {
  isSubmitting.value = true
  try {
    combatStore.playerTeam.forEach((pokemon, i) => {
      const replaceIdx = selectedReplaceIndex.value[i]
      const newMove = selectedNewMove.value[i]
      // Solo muta el ataque si efectivamente se seleccionaron ambos campos
      if (replaceIdx !== undefined && newMove) {
        pokemon.attacks[replaceIdx] = newMove
      }
    })
    await new Promise(resolve => setTimeout(resolve, 300))
    towerManager.nextFloor()
  } catch (error) {
    console.error(error)
    isSubmitting.value = false
  }
}

onMounted(() => {
  selectedNewMove.value = combatStore.playerTeam.map(() => null)
  selectedReplaceIndex.value = combatStore.playerTeam.map(() => undefined)
})

watch(mode, (val) => {
  if (val === 'moves') fetchNewMovesForTeam()
})
</script>