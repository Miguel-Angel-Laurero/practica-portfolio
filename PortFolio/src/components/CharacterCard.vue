<template>
    <div class="p-4 rounded-xl border-2 bg-white">
        <img v-if="sprite" :src="sprite" :alt="name" class="w-32 h-32 object-contain mx-auto">
        <h2 class="text-xl font-bold text-indigo">{{ name }}</h2>
        <h3 class="text-lg font-semibold text-indigo">HP: {{ hp }}/{{ maxHp }}</h3>
        <h3 v-if="shield > 0" class="text-sm text-blue-600">Escudo: {{ shield }}</h3>
    </div>
</template>
<script setup>
    const props = defineProps({
        name: {
            type: String,
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
        shield: {
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
</script>