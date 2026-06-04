<template>
  <div class="min-h-screen bg-slate-900 p-4 text-slate-200 font-sans">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button
        class="bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-slate-700 hover:text-slate-100 transition-colors"
        @click="$router.back()"
      >← Volver</button>
      <h1 class="flex-1 text-xl font-bold text-slate-100 m-0">Gestión de Equipo</h1>
      <span class="bg-blue-950 border border-blue-500 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
        Piso {{ towerStore.currentFloor }}
      </span>
    </div>

    <!-- Empty -->
    <div v-if="playerTeam.length === 0" class="text-center py-16 text-slate-500">
      <p>No hay ningún Pokémon en el equipo.</p>
    </div>

    <!-- Team list -->
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="(pokemon, index) in playerTeam"
        :key="pokemon.id"
        class="bg-slate-800 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
        :class="{
          'border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.13)]': index === activePlayerIndex,
          'border-slate-700 hover:border-slate-500': index !== activePlayerIndex,
          'opacity-60': pokemon.hp <= 0
        }"
        @click="selectedIndex = selectedIndex === index ? null : index"
      >
        <!-- Card header -->
        <div class="flex justify-between items-center px-4 py-2 bg-slate-950 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-semibold">#{{ index + 1 }}</span>
            <span v-if="index === activePlayerIndex" class="bg-blue-700 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Activo</span>
            <span v-if="pokemon.hp <= 0" class="bg-red-900 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">KO</span>
          </div>
          <div class="flex gap-1">
            <span
              v-for="t in pokemon.types"
              :key="t.type.name"
              class="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
              :class="typeClass(t.type.name)"
            >{{ t.type.name }}</span>
          </div>
        </div>

        <!-- Sprite + info -->
        <div class="flex items-center gap-4 px-4 py-3">
          <div class="w-18 h-18 flex-shrink-0 bg-slate-950 rounded-xl flex items-center justify-center" style="width:72px;height:72px">
            <img
              v-if="pokemon.sprite"
              :src="pokemon.sprite"
              :alt="pokemon.name"
              class="w-full h-full object-contain"
              :class="{ grayscale: pokemon.hp <= 0 }"
            />
            <span v-else class="text-3xl text-slate-600">?</span>
          </div>
          <div class="flex-1">
            <h2 class="text-base font-bold capitalize text-slate-100 mb-0.5">{{ pokemon.name }}</h2>
            <p class="text-xs text-slate-500 mb-2">Nv. {{ pokemon.level }}</p>
            <p class="text-xs text-slate-500 mb-2">Item {{ pokemon.item[0] }}</p>

            <!-- HP bar -->
            <div class="flex justify-between text-xs text-slate-400 mb-1">
              <span>HP</span>
              <span class="font-semibold text-slate-300">{{ pokemon.hp }} / {{ pokemon.maxHp }}</span>
            </div>
            <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="hpColor(pokemon)"
                :style="{ width: hpPercent(pokemon) + '%' }"
              />
            </div>
          </div>
        </div>

        <!-- Expandible stats -->
        <Transition name="expand">
          <div v-if="selectedIndex === index" class="border-t border-slate-800 p-4">

            <!-- Stats -->
            <div class="flex flex-col gap-1.5 mb-4">
              <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center gap-2">
                <span class="w-14 text-[11px] text-slate-500 text-right flex-shrink-0">{{ statLabel(stat.stat.name) }}</span>
                <div class="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    style="background: linear-gradient(90deg, #3b82f6, #8b5cf6); transition: width 0.5s ease"
                    :style="{ width: statPercent(stat.base_stat) + '%' }"
                  />
                </div>
                <span class="w-7 text-xs font-semibold text-slate-300 text-right">{{ stat.base_stat }}</span>
              </div>
            </div>

            <!-- Attacks -->
            <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ataques</h3>
            <div class="grid grid-cols-2 gap-1.5">
              <div
                v-for="attack in pokemon.attacks"
                :key="attack.name"
                class="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 flex flex-col gap-0.5"
              >
                <span class="text-xs font-semibold capitalize text-slate-200">{{ attack.name }}</span>
                <span class="flex gap-2 text-[11px] text-slate-500">
                  <span v-if="attack.power">💥 {{ attack.power }}</span>
                  <span v-if="attack.damageClass" class="capitalize">{{ attack.damageClass }}</span>
                </span>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Expand hint -->
        <div class="text-center text-[11px] text-slate-600 py-1.5 border-t border-slate-800 select-none">
          {{ selectedIndex === index ? '▲ Ocultar' : '▼ Ver detalles' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCombatStore } from '@/stores/useCombatStore'
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'
import { storeToRefs } from 'pinia'

const combatStore = useCombatStore()
const towerStore = useTowerManagerStore()
const { playerTeam, activePlayerIndex } = storeToRefs(combatStore)

const selectedIndex = ref(null)

const hpPercent = (p) => Math.round((p.hp / p.maxHp) * 100)
const hpColor = (p) => {
  const pct = hpPercent(p)
  if (pct > 50) return 'bg-green-500'
  if (pct > 20) return 'bg-yellow-400'
  return 'bg-red-500'
}

const statPercent = (val) => Math.min(100, Math.round((val / 150) * 100))

const statLabel = (name) => ({
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Vel.',
}[name] ?? name)

const typeClass = (type) => ({
  fire:     'bg-orange-950 text-orange-300',
  water:    'bg-blue-950 text-blue-300',
  grass:    'bg-green-950 text-green-300',
  electric: 'bg-yellow-950 text-yellow-300',
  psychic:  'bg-pink-950 text-pink-300',
  ice:      'bg-cyan-950 text-cyan-300',
  dragon:   'bg-indigo-950 text-indigo-300',
  dark:     'bg-stone-900 text-stone-400',
  fairy:    'bg-fuchsia-950 text-fuchsia-300',
  fighting: 'bg-red-950 text-red-300',
  poison:   'bg-purple-950 text-purple-300',
  ground:   'bg-amber-950 text-amber-300',
  rock:     'bg-stone-800 text-stone-300',
  bug:      'bg-lime-950 text-lime-300',
  ghost:    'bg-violet-950 text-violet-300',
  steel:    'bg-slate-800 text-slate-300',
  normal:   'bg-zinc-800 text-zinc-400',
  flying:   'bg-sky-950 text-sky-300',
}[type] ?? 'bg-slate-700 text-slate-300')
</script>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 600px; }
</style>