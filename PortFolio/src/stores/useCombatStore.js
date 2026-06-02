import router from '@/router'
import { defineStore } from 'pinia'

const cloneCreature = (creature) => ({ ...creature })

export const useCombatStore = defineStore('combat', {
  state: () => ({
    playerTeam: [],
    enemyTeam: [],
    currentTurn: 'player',
    logs: [],
  }),
  getters: {
    alivePlayers: (state) => state.playerTeam.filter((character) => character.hp > 0),
    aliveEnemies: (state) => state.enemyTeam.filter((character) => character.hp > 0),
  },
  actions: {
    setPlayerTeamFromObjects(creatures) {
      this.playerTeam = creatures.map(cloneCreature)
    },
    setEnemyTeamFromObjects(creatures) {
      this.enemyTeam = creatures.map(cloneCreature)
    },
    resetBattle() {
      this.currentTurn = 'player'
      this.logs = []
      this.playerTeam = this.playerTeam.map((character) => ({
        ...character,
        hp: character.maxHp,
      }))
      this.enemyTeam = this.enemyTeam.map((character) => ({
        ...character,
        hp: character.maxHp,
      }))
    },
    executePlayerAction(actionType) {
      if (this.currentTurn !== 'player') return

      switch (actionType) {
        case 'skill-1':
          this.attackFirstEnemy()
          break;
        case 'skill-2':
          break;
        case 'skill-3':
          break;
        case 'skill-4':
          break;
        case 'items':
          break
        case 'flee':
          this.addLog('Tu equipo huye del combate.')
          router.push('/')
          return
      }

      this.checkBattleStatus()
    },
    attackFirstEnemy() {
      const target = this.aliveEnemies[0]
      if (!target) return

      const damage = 15
      target.hp = Math.max(0, target.hp - damage)
      this.addLog(`Has atacado a ${target.name} por ${damage} de dano.`)
    },
    enemyTurn() {
      const attacker = this.aliveEnemies[0]
      const target = this.alivePlayers[0]

      if (!attacker || !target) {
        this.checkBattleStatus()
        return
      }

      const damage = 10
      const shieldDamage = Math.min(target.shield, damage)
      const hpDamage = damage - shieldDamage

      target.shield -= shieldDamage
      target.hp = Math.max(0, target.hp - hpDamage)
      this.addLog(`${attacker.name} ataca a ${target.name} por ${damage} de dano.`)

      this.checkBattleStatus()
    },
    checkBattleStatus() {
      if (this.aliveEnemies.length === 0) {
        this.addLog('Victoria. Has derrotado al equipo enemigo.')
        this.currentTurn = 'game_over'
        router.push('/')
        return
      }

      if (this.alivePlayers.length === 0) {
        this.addLog('Derrota. Tu equipo ha caido.')
        this.currentTurn = 'game_over'
        router.push('/')
        return
      }

      if (this.currentTurn === 'player') {
        this.currentTurn = 'enemy'
        setTimeout(() => this.enemyTurn(), 1200)
      } else if (this.currentTurn === 'enemy') {
        this.currentTurn = 'player'
      }
    },
    addLog(message) {
      this.logs.unshift(message)
    },
  },
})
