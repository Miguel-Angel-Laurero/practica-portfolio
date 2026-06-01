
<template>
  <header>
    <div class="wrapper">
      <nav>
        <Menu></Menu>
      </nav>
    </div>
  </header>
  <main>
      <RouterView></RouterView>
  </main>
</template>
<script setup>
  import { RouterView } from 'vue-router';
  import Menu from './components/menu/Menu.vue';
</script>

