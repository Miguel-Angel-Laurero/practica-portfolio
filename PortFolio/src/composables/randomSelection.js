import { useApi } from '@/composables/useApi'

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
    if (selectedIndexes.has(randomIndex)) continue

    selectedIndexes.add(randomIndex)
    const creatureSummary = availablePool[randomIndex]
    if (!creatureSummary?.url) continue

    try {
      const detailsResponse = await fetch(creatureSummary.url)
      if (!detailsResponse.ok) throw new Error('Error fetching creature details')
      const details = await detailsResponse.json()
      const hpStat = details.stats?.find((stat) => stat.stat.name === 'hp')?.base_stat || 100
      const sprite = details.sprites?.other?.['official-artwork']?.front_default || details.sprites?.front_default
      optionList.push({
        id: details.id?.toString() || creatureSummary.name,
        name: details.name,
        stats: details.stats || [],
        hp: hpStat,
        maxHp: hpStat,
        shield: 0,
        energy: 3,
        sprite: sprite,
        types: details.types?.map((type) => type.type.name) || [],
      })
    } catch (err) {
      console.warn('randomSelection: failed to load details for', creatureSummary.name, err)
    }
  }

  return optionList
}