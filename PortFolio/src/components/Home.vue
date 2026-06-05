<template>
  <div 
    class="flex flex-col items-center justify-center h-full text-white p-8 gap-6" 
    :style="{ 
      backgroundImage: `url('img/Tower_reception.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <div class="bg-slate-800 p-4 rounded-2xl">
      <h1 class="flex text-4xl font-bold justify-center">Torre de Batalla</h1>
      <p class="text-gray-400 text-center max-w-sm">
        Asciende por los pisos, derrota equipos enemigos y fortalece a tus Pokémon para ser el mejor.
      </p>
      <div class="flex gap-8 text-center justify-center mt-4">
        <div class="bg-white/10 rounded-xl p-4 w-32">
          <p class="text-2xl font-bold">{{ towerManager.getCurrentFloor || 0 }}</p>
          <p class="text-sm text-gray-400">Piso actual</p>
        </div>
        <div class="bg-white/10 rounded-xl p-4 w-32">
          <p class="text-2xl font-bold">{{ towerManager.getMaxFloor }}</p>
          <p class="text-sm text-gray-400">Máximo alcanzado</p>
        </div>
      </div>
    </div>

    <button
      v-if="towerManager.canContinue"
      class="px-8 py-3 bg-green-400 text-slate-900 rounded-xl font-bold text-lg cursor-pointer hover:bg-green-300 transition-colors"
      @click="towerManager.continueFromCheckpoint()"
    >
      Continuar desde piso {{ towerManager.checkpointFloor }} →
    </button>

    <button
      class="px-8 py-3 bg-white text-blue-950 rounded-xl font-bold text-lg cursor-pointer hover:bg-blue-300 transition-colors"
      @click="() => { towerManager.resetTower(); router.push('teamSelection') }"
    >
      Nueva partida →
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'

const router = useRouter()
const towerManager = useTowerManagerStore()
</script>