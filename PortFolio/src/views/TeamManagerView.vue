<template>
  <div class="team-manager">
    <div class="header">
      <button class="back-btn" @click="$router.back()">← Volver</button>
      <h1 class="title">Gestión de Equipo</h1>
      <span class="floor-badge">Piso {{ towerStore.currentFloor }}</span>
    </div>

    <div v-if="playerTeam.length === 0" class="empty-state">
      <p>No hay ningún Pokémon en el equipo.</p>
    </div>

    <div v-else class="team-grid">
      <div
        v-for="(pokemon, index) in playerTeam"
        :key="pokemon.id"
        class="pokemon-card"
        :class="{ 'is-active': index === activePlayerIndex, 'is-fainted': pokemon.hp <= 0 }"
        @click="selectedIndex = selectedIndex === index ? null : index"
      >
        <!-- Cabecera de la card -->
        <div class="card-header">
          <div class="card-header-left">
            <span class="pokemon-index">#{{ index + 1 }}</span>
            <span v-if="index === activePlayerIndex" class="active-badge">Activo</span>
            <span v-if="pokemon.hp <= 0" class="fainted-badge">KO</span>
          </div>
          <div class="type-badges">
            <span
              v-for="t in pokemon.types"
              :key="t.type.name"
              class="type-badge"
              :class="`type-${t.type.name}`"
            >{{ t.type.name }}</span>
          </div>
        </div>

        <!-- Sprite + nombre -->
        <div class="card-body">
          <div class="sprite-wrap">
            <img
              v-if="pokemon.sprite"
              :src="pokemon.sprite"
              :alt="pokemon.name"
              class="sprite"
              :class="{ grayscale: pokemon.hp <= 0 }"
            />
            <div v-else class="sprite-placeholder">?</div>
          </div>
          <div class="pokemon-info">
            <h2 class="pokemon-name">{{ pokemon.name }}</h2>
            <p class="pokemon-level">Nv. {{ pokemon.level }}</p>

            <!-- Barra de HP -->
            <div class="hp-section">
              <div class="hp-label">
                <span>HP</span>
                <span class="hp-numbers">{{ pokemon.hp }} / {{ pokemon.maxHp }}</span>
              </div>
              <div class="hp-bar-bg">
                <div
                  class="hp-bar-fill"
                  :class="hpColor(pokemon)"
                  :style="{ width: hpPercent(pokemon) + '%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Stats expandibles -->
        <Transition name="expand">
          <div v-if="selectedIndex === index" class="card-details">
            <div class="stats-grid">
              <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-row">
                <span class="stat-name">{{ statLabel(stat.stat.name) }}</span>
                <div class="stat-bar-bg">
                  <div
                    class="stat-bar-fill"
                    :style="{ width: statPercent(stat.base_stat) + '%' }"
                  />
                </div>
                <span class="stat-value">{{ stat.base_stat }}</span>
              </div>
            </div>

            <div class="attacks-section">
              <h3 class="section-title">Ataques</h3>
              <div class="attacks-grid">
                <div
                  v-for="attack in pokemon.attacks"
                  :key="attack.name"
                  class="attack-chip"
                  :class="`type-${attack.type}`"
                >
                  <span class="attack-name">{{ attack.name }}</span>
                  <span class="attack-meta">
                    <span v-if="attack.power">💥 {{ attack.power }}</span>
                    <span v-if="attack.damageClass" class="attack-class">{{ attack.damageClass }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <div class="expand-hint">{{ selectedIndex === index ? '▲ Ocultar' : '▼ Ver detalles' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCombatStore } from '@/stores/useCombatStore'
import { useTowerManagerStore } from '@/stores/useTowerManagerStore'
import { storeToRefs } from 'pinia'

const combatStore = useCombatStore()
const towerStore = useTowerManagerStore()
const { playerTeam, activePlayerIndex } = storeToRefs(combatStore)

const selectedIndex = ref(null)

const hpPercent = (p) => Math.round((p.hp / p.maxHp) * 100)
const hpColor = (p) => {
  const pct = hpPercent(p)
  if (pct > 50) return 'hp-green'
  if (pct > 20) return 'hp-yellow'
  return 'hp-red'
}

const statPercent = (val) => Math.min(100, Math.round((val / 150) * 100))

const statLabel = (name) => ({
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Vel.',
}[name] ?? name)
</script>

<style scoped>
.team-manager {
  min-height: 100vh;
  background: #0f172a;
  padding: 1rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #e2e8f0;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.back-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.back-btn:hover { background: #334155; color: #e2e8f0; }

.title {
  flex: 1;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: #f1f5f9;
}

.floor-badge {
  background: #1e3a5f;
  border: 1px solid #3b82f6;
  color: #93c5fd;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.team-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pokemon-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s;
  cursor: pointer;
}
.pokemon-card:hover { border-color: #475569; }
.pokemon-card.is-active { border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f620; }
.pokemon-card.is-fainted { opacity: 0.6; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
}
.card-header-left { display: flex; align-items: center; gap: 0.5rem; }

.pokemon-index { font-size: 0.75rem; color: #64748b; font-weight: 600; }

.active-badge {
  background: #1d4ed8;
  color: #bfdbfe;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.fainted-badge {
  background: #7f1d1d;
  color: #fca5a5;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
  border-radius: 20px;
  text-transform: uppercase;
}

.type-badges { display: flex; gap: 0.3rem; }
.type-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  text-transform: capitalize;
  background: #334155;
  color: #cbd5e1;
}
/* Colores por tipo */
.type-fire { background: #7c2d12; color: #fdba74; }
.type-water { background: #1e3a5f; color: #93c5fd; }
.type-grass { background: #14532d; color: #86efac; }
.type-electric { background: #713f12; color: #fde047; }
.type-psychic { background: #831843; color: #f9a8d4; }
.type-ice { background: #164e63; color: #a5f3fc; }
.type-dragon { background: #1e1b4b; color: #a5b4fc; }
.type-dark { background: #1c1917; color: #a8a29e; }
.type-fairy { background: #4a044e; color: #f0abfc; }
.type-fighting { background: #431407; color: #fb923c; }
.type-poison { background: #3b0764; color: #d8b4fe; }
.type-ground { background: #431a03; color: #fcd34d; }
.type-rock { background: #292524; color: #d6d3d1; }
.type-bug { background: #1a2e05; color: #a3e635; }
.type-ghost { background: #2e1065; color: #c4b5fd; }
.type-steel { background: #1e293b; color: #94a3b8; }
.type-normal { background: #27272a; color: #a1a1aa; }
.type-flying { background: #1e3a5f; color: #bae6fd; }

.card-body {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 1rem;
}

.sprite-wrap {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  background: #0f172a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sprite { width: 100%; height: 100%; object-fit: contain; }
.sprite.grayscale { filter: grayscale(1); }
.sprite-placeholder { font-size: 2rem; color: #475569; }

.pokemon-info { flex: 1; }
.pokemon-name {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: capitalize;
  margin: 0 0 0.1rem;
  color: #f1f5f9;
}
.pokemon-level { font-size: 0.8rem; color: #64748b; margin: 0 0 0.5rem; }

.hp-section { }
.hp-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}
.hp-numbers { font-weight: 600; color: #cbd5e1; }
.hp-bar-bg {
  height: 6px;
  background: #0f172a;
  border-radius: 999px;
  overflow: hidden;
}
.hp-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}
.hp-green { background: #22c55e; }
.hp-yellow { background: #eab308; }
.hp-red { background: #ef4444; }

.card-details {
  border-top: 1px solid #1e293b;
  padding: 1rem;
}

.stats-grid { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
.stat-row { display: flex; align-items: center; gap: 0.5rem; }
.stat-name { width: 60px; font-size: 0.72rem; color: #64748b; text-align: right; flex-shrink: 0; }
.stat-bar-bg {
  flex: 1;
  height: 5px;
  background: #0f172a;
  border-radius: 999px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 999px;
  transition: width 0.5s ease;
}
.stat-value { width: 30px; font-size: 0.75rem; font-weight: 600; color: #cbd5e1; text-align: right; }

.section-title { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.5rem; }

.attacks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
.attack-chip {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.attack-name { font-size: 0.78rem; font-weight: 600; text-transform: capitalize; color: #e2e8f0; }
.attack-meta { display: flex; gap: 0.5rem; font-size: 0.68rem; color: #64748b; }
.attack-class { text-transform: capitalize; }

.expand-hint {
  text-align: center;
  font-size: 0.7rem;
  color: #334155;
  padding: 0.4rem;
  border-top: 1px solid #1e293b;
  user-select: none;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: #475569;
}

/* Transición expandir */
.expand-enter-active, .expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>