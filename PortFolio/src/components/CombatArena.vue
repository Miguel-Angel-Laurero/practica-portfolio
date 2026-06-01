<template>
  <div class="combat-arena">
    <CharacterCard
      :name="player.name"
      :hp="player.hp"
      :maxHp="player.maxHp"
      :shield="player.shield"
      :isPlayer="true"
    />

    <CharacterCard
      :name="enemy.name"
      :hp="enemy.hp"
      :maxHp="enemy.maxHp"
      :shield="enemy.shield"
      :isPlayer="false"
    />
  </div>
</template>

<script setup>
import CharacterCard from './CharacterCard.vue'

const enemy = {
  name: 'Enemigo',
  hp: 50,
  maxHp: 50,
  shield: 0,
}
const player = {
  name: 'Jugador',
  hp: 150,
  maxHp: 150,
  shield: 50,
}
</script>

<style scoped>
.combat-arena {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem;
  box-sizing: border-box;
  background: #0f172a; /* slate-900 fallback */
  min-height: calc(100vh - 90px); /* leave room for fixed action menu */
}
</style>