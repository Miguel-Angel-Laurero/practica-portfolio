<template>
  <div class="flex justify-between items-center p-8 gap-8">
    <button
      @click="towerManager.selectMode('female')"
      class="bg-blue-100 rounded-full  max-w-96 cursor-pointer hover:bg-blue-200 transition-colors"
    >
      <img src="../../img/Tower_assistant_female.png" alt="Asistente femenina" class="rounded-full"/>
      <span class=" p-12 text-md font-bold">Guardería</span>
    </button>
    <button
      @click="towerManager.selectMode('male')"
      class="bg-blue-100 rounded-full max-w-96 cursor-pointer hover:bg-blue-200 transition-colors"
    >
      <img src="../../img/Tower_assistant_male.png" alt="Asistente masculino" class="rounded-full"/>
      <span class=" p-12 text-md font-bold">Gimnasio</span>
    </button>
    <button
      @click="towerManager.selectMode('shop')" 
      class="bg-blue-100 rounded-full  max-w-96 cursor-pointer hover:bg-blue-200 transition-colors"
    >
      <img src="../../img/Tower_assistant_shop.png" alt="Asistente masculino" class="rounded-full"/>
      <span class=" p-12 text-md font-bold">Tienda</span>
    </button>
  </div>
</template>

<script setup>
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'
const towerManager = useTowerManagerStore()
</script>