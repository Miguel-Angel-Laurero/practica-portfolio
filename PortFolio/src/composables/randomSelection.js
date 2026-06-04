import { useApi } from '@/composables/useApi'
import { startingAttacks } from '@/helpers/generateAttacks'
import { fetchEvolutionData } from '@/helpers/evolutionHelper'

const LEVEL = 5

function randomIV() {
  return Math.floor(Math.random() * 32)
}

function calcStat(base, iv, level, isHp = false) {
  if (isHp) return Math.floor(((2 * base + iv) * level) / 100) + level + 10
  return Math.floor(((2 * base + iv) * level) / 100) + 5
}

function baseStatsLimit(stats) {
  let totalBase = 0;
  stats.forEach(stat => {
    totalBase += stat.base_stat
  });
  return totalBase
}

export default async function randomSelection(count = 6, excludeNames = [], maxBaseStats = 320) {
  const { data, error, fetchApi } = useApi('/pokemon?limit=100000')

  await fetchApi()

  if (error.value) {
    console.error('Error fetching creatures:', error.value)
    return []
  }

  const creaturePool = data.value?.results || []
  const availablePool = creaturePool.filter((creature) => !excludeNames.includes(creature.name))
  if (!availablePool.length) {
    console.warn('randomSelection: no creatures available')
    return []
  }

  const optionList = []
  const selectedIndexes = new Set()

  while (optionList.length < count && selectedIndexes.size < availablePool.length) {
    const randomIndex = Math.floor(Math.random() * availablePool.length)
    if (selectedIndexes.has(randomIndex)) continue

    selectedIndexes.add(randomIndex)
    const creatureSummary = availablePool[randomIndex]
    if (!creatureSummary?.url) continue

    try {
      const detailsResponse = await fetch(creatureSummary.url)
      if (!detailsResponse.ok) throw new Error('Error fetching creature details')
      const details = await detailsResponse.json()
      
      //comprobamos el limite de stats base para saber si el pokemon es valido
      if (maxBaseStats >= baseStatsLimit(details.stats)) {
        
        const scaledStats = (details.stats || []).map((s) => {
          const iv = randomIV()
          const isHp = s.stat.name === 'hp'
          return {
            ...s,
            base_stat: calcStat(s.base_stat, iv, LEVEL, isHp),
            base_stat_base: s.base_stat, // 👈 base original de la API
            iv,                          // 👈 IV fijo para recalcular en levelup
          }
        })
  
        const hpStat = scaledStats.find((s) => s.stat.name === 'hp')?.base_stat ?? 10
        const sprite = details.sprites?.other?.['official-artwork']?.front_default || details.sprites?.front_default
  
        const EXCLUDED_SUFFIXES = ['-mega', '-gmax', '-mega-z', '-mega-x']
        const baseName = EXCLUDED_SUFFIXES.reduce(
          (name, suffix) => (name.endsWith(suffix) ? name.slice(0, -suffix.length) : name),
          details.name,
        )
  
        let attackDetails = details
        if (baseName !== details.name) {
          const baseResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${baseName}`)
          if (baseResponse.ok) attackDetails = await baseResponse.json()
        }
  
        const attacks = await startingAttacks(attackDetails)
        // Dentro del push, después de tener details:
        const nextEvolution = await fetchEvolutionData(details)
        
        optionList.push({
          id: details.id?.toString() || creatureSummary.name,
          name: details.name,
          level: LEVEL,
          stats: scaledStats,
          hp: hpStat,
          maxHp: hpStat,
          sprite: sprite,
          types: details.types || [],
          attacks: attacks,
          learnableMoves: details.moves?.map((m) => ({ name: m.move.name, url: m.move.url })) ?? [],
          nextEvolution,
          item: [],
        })
      }

    } catch (err) {
      console.warn('randomSelection: failed to load details for', creatureSummary.name, err)
    }
  }

  return optionList
}