import { defineStore } from 'pinia'
import router from '@/router'
import randomSelection from '@/composables/randomSelection'
import { useCombatStore } from '@/stores/useCombatStore'

export const useTowerManagerStore = defineStore('towerManager', {
  state: () => ({
    currentFloor: 0,
    maxFloorReached: 0,
    floorsSurvivals: [],
    selectedMode: null,
    savedTeam: null,
    checkpointFloor: 0,
  }),

  getters: {
    isFloorActive: (state) => state.currentFloor > 0,
    getCurrentFloor: (state) => state.currentFloor,
    getMaxFloor: (state) => state.maxFloorReached,
    canContinue: (state) => state.savedTeam !== null && state.checkpointFloor > 0,
    getFloorDifficulty: (state) => {
      const difficulty = Math.ceil(state.currentFloor / 5)
      return { level: difficulty, multiplier: 1 + difficulty * 0.2 }
    },
  },

  actions: {
    nextFloor() {
      this.currentFloor++
      if (this.currentFloor >= this.maxFloorReached) {
        this.maxFloorReached = this.currentFloor
      }
      if (this.currentFloor % 5 === 0) {
        const combatStore = useCombatStore()
        this.savedTeam = JSON.parse(JSON.stringify(combatStore.playerTeam))
        this.checkpointFloor = this.currentFloor
      }
      this.checkEvents()
    },

    resetTower() {
      this.currentFloor = 0
      this.floorsSurvivals = []
      this.savedTeam = null
      this.checkpointFloor = 0
    },

    async continueFromCheckpoint() {
      if (!this.canContinue || !this.savedTeam) return
      const combatStore = useCombatStore()
      this.currentFloor = this.checkpointFloor
      combatStore.setPlayerTeamFromObjects(JSON.parse(JSON.stringify(this.savedTeam)))
      await this.checkEvents()
    },

    saveFloorSurvival(floorData) {
      this.floorsSurvivals.push({
        floor: this.currentFloor,
        timestamp: new Date().toISOString(),
        ...floorData,
      })
    },

    selectMode(mode) {
      this.selectedMode = mode
      if (mode === 'female') {
        router.push({ name: 'choose-pokemon' })
      } else {
        router.push({ name: 'train' })
      }
    },

    async checkEvents() {
      if (this.currentFloor % 10 === 0) {
        await router.push({ name: 'combat' })
        return
      } else if (this.currentFloor % 5 === 0) {
        await router.push({ name: 'event' })
        return
      } else {
        const combatStore = useCombatStore()
        const { enemyCount } = this.getCurrentFloorEnemyDifficulty()
        const statLimit = 320 + Math.floor(this.currentFloor / 10) * 40
        const newEnemyTeam = await randomSelection(enemyCount, [], statLimit)
        combatStore.setEnemyTeamFromObjects(newEnemyTeam)
        combatStore.resetBattle()
        await router.push({ name: 'combat' })
      }
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

    finishBattle(result = 'victory') {
      if (result === 'victory') {
        this.nextFloor()
      } else {
        this.currentFloor = 0
        router.push('/home')
      }
    },
  },

  persist: true,
})