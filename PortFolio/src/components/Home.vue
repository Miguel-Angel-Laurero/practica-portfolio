<template>
  <div class="flex flex-col items-center justify-center h-full bg-blue-950 text-white p-8 gap-6">
    <h1 class="text-4xl font-bold">Torre de Batalla</h1>
    <p class="text-gray-400 text-center max-w-sm">
      Asciende por los pisos, derrota equipos enemigos y fortalece a tus Pokémon para ser el mejor.
    </p>

    <div class="flex gap-8 text-center">
      <div class="bg-white/10 rounded-xl p-4 w-32">
        <p class="text-2xl font-bold">{{ towerManager.getCurrentFloor || 0 }}</p>
        <p class="text-sm text-gray-400">Piso actual</p>
      </div>
      <div class="bg-white/10 rounded-xl p-4 w-32">
        <p class="text-2xl font-bold">{{ towerManager.getMaxFloor }}</p>
        <p class="text-sm text-gray-400">Máximo alcanzado</p>
      </div>
    </div>
    <button
      class="mt-4 px-8 py-3 bg-white text-blue-950 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors"
      @click="router.push('teamSelection')"
    >
      Entrar en la torre →
    </button>
    <!-- <button
      class="mt-4 px-8 py-3 bg-white text-blue-950 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors"
      @click="towerManager.nextFloor()"
    >
      Subir al siguiente piso →
    </button> -->
  </div>
</template>

<script setup>
import router from '@/router';
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'

const towerManager = useTowerManagerStore()
</script>