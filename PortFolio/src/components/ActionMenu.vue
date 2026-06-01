<template>
  <div class="action-menu">
    <button class="item" @click="">Atacar</button>
    <button class="item" @click="">Defender</button>
    <button class="item" @click="">Curación</button>
    <button class="item" @click="">Huir</button>
  </div>
</template>
<script setup>

</script>

<style scoped>
.action-menu {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px;
  box-sizing: border-box;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
}
.action-menu .item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-weight: 600;
}
</style>