import router from '@/router'
import { defineStore } from 'pinia'
import { damageCalculator } from '@/helpers/damageCalculator'
import { bonifierCalculator } from '@/helpers/bonifierCalculator'
import { playerGoesFirst } from '@/helpers/combatUtils'

const cloneCreature = (creature) => ({
  ...creature,
  stats: creature.stats.map((s) => ({ ...s })),
})

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
    },

    autoSwitchActivePlayer() {
      const nextIndex = this.playerTeam.findIndex(
        (c, i) => i !== this.activePlayerIndex && c.hp > 0,
      )
      if (nextIndex !== -1) {
        this.activePlayerIndex = nextIndex
        this.addLog(`¡${this.activePlayer.name} entra al combate!`)
      }
    },

    autoSwitchActiveEnemy() {
      const nextIndex = this.enemyTeam.findIndex(
        (c, i) => i !== this.activeEnemyIndex && c.hp > 0,
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
          this.resolveRound(attack)
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
    },

resolveRound(attack) {
  const goFirst = playerGoesFirst(this.activePlayer, this.activeEnemy)
  this.addLog(`${goFirst ? this.activePlayer.name : this.activeEnemy.name} ataca primero.`)
  this.currentTurn = 'resolving'

  if (goFirst) {
    const enemyFainted = this.attackActiveEnemy(attack)
    if (this.checkBattleStatus()) return
    if (enemyFainted) return // 👈 enemigo KO, no contraataca

    setTimeout(() => {
      this.enemyAttack()
      this.checkBattleStatus()
    }, 1200)
  } else {
    const playerFainted = this.enemyAttack()
    if (this.checkBattleStatus()) return
    if (playerFainted) return // 👈 jugador KO, no contraataca

    setTimeout(() => {
      this.attackActiveEnemy(attack)
      this.checkBattleStatus()
    }, 1200)
  }
},

    performAttack(attacker, target, attack = { name: 'Ataque', power: 15 }) {
      if (!attacker || !target) return 0

      this.addLog(`${attacker.name} usa ${attack.name} contra ${target.name}`)
      //efectividad
      const effectiveness = bonifierCalculator(attack, attacker, target)

      if (effectiveness === 0) {
        this.addLog(`¡No afecta a ${target.name}!`)
        return 0
      } else if (effectiveness < 1) {
        this.addLog(`No es muy eficaz...`)
      } else if (effectiveness > 1) {
        this.addLog(`¡Es muy eficaz!`)
      }

      const damage = Math.round(damageCalculator(attack, attacker, target, effectiveness))
      target.hp = Math.max(0, target.hp - damage)
      return damage
    },

    attackActiveEnemy(attack = { name: 'Ataque', power: 15 }) {
      const attacker = this.activePlayer
      const target = this.activeEnemy
      if (!attacker || !target) return
      this.performAttack(attacker, target, attack)
      if (target.hp <= 0) {
        this.addLog('El '+target.name+' rival ha sido debilitado.')
        this.autoSwitchActiveEnemy()
        return true
      } 
    },

    enemyAttack() {
      const attacker = this.activeEnemy
      const target = this.activePlayer
      if (!attacker || !target) return
      const attack =
        attacker.attacks?.[Math.floor(Math.random() * attacker.attacks.length)] ||
        { name: 'Ataque enemigo', power: 10 }
      this.performAttack(attacker, target, attack)
      if (target.hp <= 0) { 
        this.addLog(target.name+' ha sido debilitado.')
        this.autoSwitchActivePlayer()
        return true
      }
    },

    // Devuelve true si la batalla terminó
    checkBattleStatus() {
      if (this.aliveEnemies.length === 0) {
        this.addLog('Victoria. Has derrotado al equipo enemigo.')
        this.playerTeam.forEach((pokemon) => {
          this.levelUp(pokemon)
        })
        this.currentTurn = 'game_over'
        this.battleResult = '¡Victoria! Has derrotado al equipo enemigo y tu equipo se ha hecho mas fuerte'
        return true
      }
      if (this.alivePlayers.length === 0) {
        this.addLog('Derrota. Tu equipo ha caido.')
        this.currentTurn = 'game_over'
        this.battleResult = 'Derrota. Tu equipo ha caido.'
        return true
      }
      this.currentTurn = 'player'
      return false
    },
    levelUp(pokemon) {
      const index = this.playerTeam.findIndex((p) => p.id === pokemon.id)
      console.log('levelUp index:', index)
      console.log('pokemon antes:', JSON.parse(JSON.stringify(this.playerTeam[index])))
      if (index === -1) return

      const p = this.playerTeam[index]
      p.level += 1

      p.stats = p.stats.map((s) => {
        const isHp = s.stat.name === 'hp'
        const newStat = isHp
          ? Math.floor(((2 * s.base_stat_base + s.iv) * p.level) / 100) + p.level + 10
          : Math.floor(((2 * s.base_stat_base + s.iv) * p.level) / 100) + 5
        return { ...s, base_stat: newStat }
      })

      const newMaxHp = p.stats.find((s) => s.stat.name === 'hp')?.base_stat ?? p.maxHp
      const hpGained = newMaxHp - p.maxHp
      p.maxHp = newMaxHp
      p.hp = Math.min(p.maxHp, p.hp + hpGained)

      this.addLog(`¡${p.name} ha subido al nivel ${p.level}!`)
    },

    addLog(message) {
      this.logs.unshift(message)
    },
  },
})