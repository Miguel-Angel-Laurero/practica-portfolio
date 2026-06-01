<template>
    <div class="p-4 rounded-xl border-2 bg-white">
        <h2 class="text-xl font-bold text-white">{{ name }}</h2>
        <h3 class="text-xl font-bold text-white">HP: {{ hp }}</h3>
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
        isPlayer: {
            type: Boolean,
            default: false,
        },
    })
</script>