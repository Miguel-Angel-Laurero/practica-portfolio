<template>
    <RouterLink to="combat">Empezar Combate</RouterLink>
    <RouterLink  v-if="inCombat" to="combat">Salir del Combate</RouterLink>
</template>
<script setup>

</script>