<template>
  <div class="bg-blue-950 h-full p-8 relative flex flex-col"
  :style="{ 
      backgroundImage: `url('img/Battle_arena.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }">
    <div class="flex justify-between items-center mb-6">
      <RouterLink class="bg-blue-100 hover:bg-blue-200 p-2 rounded-xl" to="/home">Salir de la torre</RouterLink>
      <h1 class="flex text-4xl font-bold text-white items-center">Piso {{ towerManager.getCurrentFloor || 1 }}</h1>
      <div class="text-white text-lg">
        <span>Máximo alcanzado: Piso {{ towerManager.getMaxFloor }}</span>
      </div>
    </div>

    <div class="flex p-4 gap-8 flex-1 overflow-hidden justify-between">
      <!-- Equipo jugador -->
      <section class="flex flex-col gap-3 w-1/3">
        <h2 class="text-white font-bold text-xl mb-2">Tu Equipo</h2>

                  <!-- Equipo jugador - Activo grande -->
          <div class="relative flex flex-col items-center p-4">
            <CharacterCard
              v-if="activePlayer"
              :name="activePlayer.name"
              :level="activePlayer.level"
              :hp="activePlayer.hp"
              :maxHp="activePlayer.maxHp"
              :sprite="activePlayer.sprite"
              :isPlayer="true"
              :isActive="true"
              class="z-10"
            />
            <img src="../../img/Battle_base.png" alt="base de combate" class="w-96 mt-32 absolute"/>
          </div>

        <!-- Resto pequeños -->
        <div class="flex gap-2 flex-wrap bg-slate-800 rounded-xl mx-auto p-8">
          <CharacterCardMini
            v-for="(player, index) in playerTeam"
            :key="player.id"
            :name="player.name"
            :hp="player.hp"
            :maxHp="player.maxHp"
            :sprite="player.sprite"
            :isActive="index === activePlayerIndex"
            :isDead="player.hp <= 0"
            @click="combatStore.switchActivePokemon(index)"
          />
        </div>
      </section>

      <!-- Equipo enemigo -->
      <section class="flex flex-col gap-3 w-1/3">
        <h2 class="text-white font-bold text-xl mb-2">Equipo Rival</h2>

        <!-- Activo grande -->
        <!-- Equipo enemigo - Activo grande -->
        <div class="relative flex flex-col items-center p-4">
          <CharacterCard
            v-if="activeEnemy"
            :name="activeEnemy.name"
            :level="activeEnemy.level"
            :hp="activeEnemy.hp"
            :maxHp="activeEnemy.maxHp"
            :sprite="activeEnemy.sprite"
            :isPlayer="false"
            :isActive="true"
            class="z-10"
          />
          <img src="../../img/Battle_base.png" alt="base de combate" class="w-96 mt-32 absolute"/>
        </div>
        
        <!-- Resto pequeños -->
        <div class="flex gap-2 flex-wrap bg-slate-800 rounded-xl mx-auto p-8">
          <CharacterCardMini
            v-for="(enemy, index) in enemyTeam"
            :key="enemy.id"
            :name="combatStore.isEnemyRevealed(index) ? enemy.name : '???'"
            :hp="enemy.hp"
            :maxHp="enemy.maxHp"
            :sprite="enemy.sprite"
            :isRevealed="combatStore.isEnemyRevealed(index)"
            :isActive="index === activeEnemyIndex"
            :isDead="enemy.hp <= 0"
          />
        </div>
      </section>
    </div>

    <div
      v-if="currentTurn === 'game_over'"
      class="absolute inset-0 flex items-center justify-center bg-black/75 p-6"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full text-center">
        <h2 class="text-3xl font-bold mb-4">{{ battleResult }}</h2>
        <p v-if="combatStore.aliveEnemies.length === 0" class="text-sm text-slate-600 mb-6">¡Victoria! Avanza al siguiente piso.</p>
        <p v-else class="text-sm text-slate-600 mb-6">Tu equipo ha caído. Vuelve al inicio.</p>
        <button
          v-if="combatStore.aliveEnemies.length === 0"
          class="bg-indigo-950 text-white rounded-lg px-6 py-3 font-semibold hover:bg-indigo-800"
          @click="towerManager.finishBattle('victory')"
        >
          Siguiente Piso
        </button>
        <button
          v-else
          class="bg-red-700 text-white rounded-lg px-6 py-3 font-semibold hover:bg-red-600"
          @click="towerManager.finishBattle('defeat')"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CharacterCard from './CharacterCard.vue'
import CharacterCardMini from './CharacterCardMini.vue'
import { useCombatStore } from '@/stores/useCombatStore'
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'
import { storeToRefs } from 'pinia'

const combatStore = useCombatStore()
const towerManager = useTowerManagerStore()
const {
  playerTeam,
  enemyTeam,
  activePlayer,
  activeEnemy,
  activePlayerIndex,
  activeEnemyIndex,
  currentTurn,
  battleResult,
} = storeToRefs(combatStore)

</script>