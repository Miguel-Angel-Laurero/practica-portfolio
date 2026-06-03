<template>
  <div class="flex justify-between items-center p-8 gap-8">
    <button
      @click="towerManager.selectMode('female')"
      class="bg-blue-100 rounded-full p-12 max-w-96 cursor-pointer hover:bg-blue-200 transition-colors"
    >
      <img src="../../public/img/Tower_assistant_female.png" alt="Asistente femenina" />
    </button>
    <button
      @click="towerManager.selectMode('male')"
      class="bg-blue-100 rounded-full p-12 max-w-96 cursor-pointer hover:bg-blue-200 transition-colors"
    >
      <img src="../../public/img/Tower_assistant_male.png" alt="Asistente masculino" />
    </button>
  </div>
</template>

<script setup>
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'
const towerManager = useTowerManagerStore()
</script>