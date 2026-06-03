import { defineStore } from 'pinia'
import router from '@/router'
import randomSelection from '@/composables/randomSelection'
import { useCombatStore } from '@/stores/useCombatStore'

export const useTowerManagerStore = defineStore('towerManager', {
  state: () => ({
    currentFloor: 0,
    maxFloorReached: 0,
    floorsSurvivals: [],
  }),

  getters: {
    isFloorActive: (state) => state.currentFloor > 0,
    getCurrentFloor: (state) => state.currentFloor,
    getMaxFloor: (state) => state.maxFloorReached,
    getFloorDifficulty: (state) => {
      const difficulty = Math.ceil(state.currentFloor / 5)
      return { level: difficulty, multiplier: 1 + difficulty * 0.2 }
    },
  },

  actions: {
    async nextFloor() {
      this.currentFloor++
      if (this.currentFloor > this.maxFloorReached) {
        this.maxFloorReached = this.currentFloor
      }
      const combatStore = useCombatStore()
      const { enemyCount } = this.getCurrentFloorEnemyDifficulty()
      const newEnemyTeam = await randomSelection(enemyCount)
      combatStore.setEnemyTeamFromObjects(newEnemyTeam)
      combatStore.resetBattle()

      await router.push({ name: 'combat' })
    },

    resetTower() {
      this.currentFloor = 0
      this.floorsSurvivals = []
    },

    saveFloorSurvival(floorData) {
      this.floorsSurvivals.push({
        floor: this.currentFloor,
        timestamp: new Date().toISOString(),
        ...floorData,
      })
    },

    getCurrentFloorEnemyDifficulty() {
      const { multiplier } = this.getFloorDifficulty
      return {
        floor: this.currentFloor,
        damageMultiplier: multiplier,
        hpMultiplier: multiplier,
        enemyCount: this.currentFloor <= 5 ? 3 : Math.min(5, 3 + Math.floor((this.currentFloor - 5) / 5)),
      }
    },
    finishBattle() {
      router.push('/')
    },
  },
})