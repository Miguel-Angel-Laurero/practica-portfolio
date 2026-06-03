import { useApi } from '@/composables/useApi'
import { startingAttacks } from '@/helpers/generateAttacks'

const LEVEL = 5

function calcStat(base, level, isHp = false) {
  if (isHp) return Math.floor((2 * base * level) / 100) + level + 10
  return Math.floor((2 * base * level) / 100) + 5
}

export default async function randomSelection(count = 6, excludeNames = []) {
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
    console.log(randomIndex)
    if (selectedIndexes.has(randomIndex)) continue

    selectedIndexes.add(randomIndex)
    const creatureSummary = availablePool[randomIndex]
    if (!creatureSummary?.url) continue

    try {
      const detailsResponse = await fetch(creatureSummary.url)
      if (!detailsResponse.ok) throw new Error('Error fetching creature details')
      const details = await detailsResponse.json()
      const baseHp = details.stats?.find((s) => s.stat.name === 'hp')?.base_stat ?? 45
      const hpStat = calcStat(baseHp, LEVEL, true)
      const scaledStats = details.stats?.map((s) => ({
        ...s,
        base_stat: calcStat(s.base_stat, LEVEL, s.stat.name === 'hp'),
      })) || []
      const sprite = details.sprites?.other?.['official-artwork']?.front_default || details.sprites?.front_default

      // seccion de carga de ataques filtrando megas y g-max
      const EXCLUDED_SUFFIXES = ['-mega', '-gmax', '-mega-z']
      const baseName = EXCLUDED_SUFFIXES.reduce(
        (name, suffix) => (name.endsWith(suffix) ? name.slice(0, -suffix.length) : name),
        details.name,
      )

      let attackDetails = details
      if (baseName !== details.name) {
        const baseResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${baseName}`)
        if (baseResponse.ok) {
          attackDetails = await baseResponse.json()
          console.log(attackDetails)
        }
      }

const attacks = await startingAttacks(attackDetails)

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
      })
    } catch (err) {
      console.warn('randomSelection: failed to load details for', creatureSummary.name, err)
    }
  }

  return optionList
}
