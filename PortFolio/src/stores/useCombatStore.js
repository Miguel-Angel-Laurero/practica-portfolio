import router from '@/router'
import { defineStore } from 'pinia'
import { damageCalculator } from '@/helpers/damageCalculator'

const cloneCreature = (creature) => ({ ...creature })

export const useCombatStore = defineStore('combat', {
  state: () => ({
    playerTeam: [],
    enemyTeam: [],
    activePlayerIndex: 0,
    activeEnemyIndex: 0,
    currentTurn: 'player',
    logs: [],
    battleResult: '',
  }),
  getters: {
    alivePlayers: (state) => state.playerTeam.filter((character) => character.hp > 0),
    aliveEnemies: (state) => state.enemyTeam.filter((character) => character.hp > 0),
    activePlayer: (state) => state.playerTeam[state.activePlayerIndex] ?? null,
    activeEnemy: (state) => state.enemyTeam[state.activeEnemyIndex] ?? null,
  },
  actions: {
    setPlayerTeamFromObjects(creatures) {
      this.playerTeam = creatures.map(cloneCreature)
      this.activePlayerIndex = 0
    },
    setEnemyTeamFromObjects(creatures) {
      this.enemyTeam = creatures.map(cloneCreature)
      this.activeEnemyIndex = 0
    },
    resetBattle() {
      this.currentTurn = 'player'
      this.battleResult = ''
      this.logs = []
      this.activePlayerIndex = 0
      this.activeEnemyIndex = 0
      this.playerTeam = this.playerTeam.map((character) => ({
        ...character,
        hp: character.maxHp,
      }))
      this.enemyTeam = this.enemyTeam.map((character) => ({
        ...character,
        hp: character.maxHp,
      }))
    },

    switchActivePokemon(newIndex) {
      if (
        newIndex < 0 ||
        newIndex >= this.playerTeam.length ||
        this.playerTeam[newIndex].hp <= 0 ||
        newIndex === this.activePlayerIndex
      ) return

      const previous = this.activePlayer?.name
      this.activePlayerIndex = newIndex
      this.addLog(`${previous} vuelve. ¡Adelante, ${this.activePlayer.name}!`)
      this.checkBattleStatus();
    },
    // Llamado automáticamente cuando el activo cae en combate
    autoSwitchActivePlayer() {
      const nextIndex = this.playerTeam.findIndex(
        (c, i) => i !== this.activePlayerIndex && c.hp > 0
      )
      if (nextIndex !== -1) {
        this.activePlayerIndex = nextIndex
        this.addLog(`¡${this.activePlayer.name} entra al combate!`)
      }
    },

    autoSwitchActiveEnemy() {
      const nextIndex = this.enemyTeam.findIndex(
        (c, i) => i !== this.activeEnemyIndex && c.hp > 0
      )
      if (nextIndex !== -1) {
        this.activeEnemyIndex = nextIndex
        this.addLog(`¡El enemigo saca a ${this.activeEnemy.name}!`)
      }
    },

    executePlayerAction(actionType, attack = null) {
      if (this.currentTurn !== 'player') return

      switch (actionType) {
        case 'skill':
          this.attackActiveEnemy(attack)
          break
        case 'items':
          break
        case 'flee':
          this.addLog('Tu equipo huye del combate.')
          if (confirm('¿Seguro que quieres huir de este combate?')) {
            
            router.push('/')
          }
          return
      }

      this.checkBattleStatus()
    },

    performAttack(attacker, target, attack = { name: 'Ataque', power: 15 }) {
      if (!attacker || !target) return 0

      const damage = Math.round(damageCalculator(attack.power, attacker, target))
      
      target.hp = Math.max(0, target.hp - damage)
      this.addLog(`${attacker.name} usa ${attack.name} contra ${target.name} por ${damage} de daño.`)
      return damage
    },

    attackActiveEnemy(attack = { name: 'Ataque', power: 15 }) {
      const attacker = this.activePlayer
      const target = this.activeEnemy
      if (!attacker || !target) return

      this.performAttack(attacker, target, attack)

      // Si el enemigo activo cae, avanzar automáticamente
      if (target.hp <= 0) this.autoSwitchActiveEnemy()
    },
    
    enemyTurn() {
      const attacker = this.activeEnemy
      const target = this.activePlayer

      if (!attacker || !target) {
        this.checkBattleStatus()
        return
      }

      const attack = attacker.attacks?.[0] || { name: 'Ataque enemigo', power: 10 }
      this.performAttack(attacker, target, attack)

      // Si el jugador activo cae, avanzar automáticamente
      if (target.hp <= 0) this.autoSwitchActivePlayer()

      this.checkBattleStatus()
    },

    checkBattleStatus() {
      if (this.aliveEnemies.length === 0) {
        this.addLog('Victoria. Has derrotado al equipo enemigo.')
        this.currentTurn = 'game_over'
        this.battleResult = '¡Victoria! Has derrotado al equipo enemigo.'
        return
      }

      if (this.alivePlayers.length === 0) {
        this.addLog('Derrota. Tu equipo ha caido.')
        this.currentTurn = 'game_over'
        this.battleResult = 'Derrota. Tu equipo ha caido.'
        return
      }

      if (this.currentTurn === 'player') {
        this.currentTurn = 'enemy'
        setTimeout(() => this.enemyTurn(), 1200)
      } else if (this.currentTurn === 'enemy') {
        this.currentTurn = 'player'
      }
    },
    finishBattle() {
      router.push('/')
    },
    addLog(message) {
      this.logs.unshift(message)
    },
  },
})