<template>
  <div
    class="flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-all"
    :class="{
      'ring-2 ring-yellow-400 bg-white/10': isActive,
      'opacity-40 grayscale': isDead,
      'hover:bg-white/10': !isDead && !isActive,
    }"
    @click="$emit('click')"
  >
    <!-- No revelado -->
    <div
      v-if="!isRevealed"
      class="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-full text-xl font-bold text-white"
    >
      ?
    </div>
    <!-- Revelado -->
    <img
      v-else
      :src="sprite"
      :alt="name"
      class="w-10 h-10 object-contain"
      :class="{ 'opacity-50': isDead }"
    />

    <span class="text-white text-xs font-semibold truncate max-w-12">{{ name }}</span>
    <div class="w-10 h-1 bg-white/40 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all"
        :class="hpBarColor"
        :style="{ width: hpPercent + '%' }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  hp: Number,
  maxHp: Number,
  sprite: String,
  isActive: Boolean,
  isDead: Boolean,
  isRevealed: { type: Boolean, default: true },
})

defineEmits(['click'])

const hpPercent = computed(() => Math.max(0, (props.hp / props.maxHp) * 100))

const hpBarColor = computed(() => {
  if (hpPercent.value > 50) return 'bg-green-400'
  if (hpPercent.value > 20) return 'bg-yellow-400'
  return 'bg-red-500'
})
</script>