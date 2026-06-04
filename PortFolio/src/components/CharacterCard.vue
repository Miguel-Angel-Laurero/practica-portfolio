<template>
    <div class="grid grid-cols-2 p-4 text-white">
        <img v-if="sprite" :src="sprite" :alt="name" class="w-48 h-48 object-contain mx-auto">
        <div>
            <h2 class="text-xl font-bold">{{ name }} Lvl:{{ level }}</h2>
            <div class="w-full h-4 bg-white/40 rounded-full overflow-hidden">
            <div
                class="h-full rounded-full transition-all"
                :class="hpBarColor"
                :style="{ width: hpPercent + '%' }"
            />
            </div>
            <h3 class="text-lg font-semibold text-indigo">HP: {{ hp }}/{{ maxHp }}</h3>
            
        </div>
    </div>
</template>
<script setup>
    import { computed } from 'vue'

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        hp: {
            type: Number,
            default: 0,
        },
        maxHp: {
            type: Number,
            default: 0,
        },
        sprite: {
            type: String,
            default: null,
        },
        isPlayer: {
            type: Boolean,
            default: false,
        },
    })

    const hpPercent = computed(() => Math.max(0, (props.hp / props.maxHp) * 100))

    const hpBarColor = computed(() => {
    if (hpPercent.value > 50) return 'bg-green-400'
    if (hpPercent.value > 20) return 'bg-yellow-400'
    return 'bg-red-500'
    })
</script>