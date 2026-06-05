export async function startingAttacks(pokemon) {
  const allMoves = (pokemon.moves || []).map((entry) => entry.move).filter(Boolean)
  const uniqueMoves = Array.from(new Map(allMoves.map((move) => [move.name, move])).values())
  const attackCount = Math.min(4, uniqueMoves.length)

  if (attackCount === 0) {
    return [
      { name: 'Golpe', power: 10, type: 'normal', effects: [] },
      { name: 'Impactrueno', power: 40, type: 'electric', effects: [] },
      { name: 'Placaje', power: 50, type: 'normal', effects: [] },
      { name: 'Arañazo', power: 40, type: 'normal', effects: [] },
    ]
  }

  const shuffledMoves = uniqueMoves.sort(() => Math.random() - 0.5)
  const selectedMoves = shuffledMoves.slice(0, Math.min(uniqueMoves.length, 12))

  const fetchedAttacks = await Promise.all(
    selectedMoves.map(async (move) => {
      try {
        const response = await fetch(move.url)
        if (!response.ok) throw new Error('Error fetching attack details')

        const attackDetails = await response.json()
        return {
          name: move.name,
          power: attackDetails.power ?? 0,
          type: attackDetails.type?.name ?? 'normal', // 👈
          effects: attackDetails.effect_entries || [],
          damageClass: attackDetails.damage_class?.name,

        }
      } catch (error) {
        console.warn('startingAttacks: failed to load attack details for', move.name, error)
        return {
          name: move.name,
          power: 0,
          effects: [],
          damageClass: null,
        }
      }
    }),
  )

  const damagingAttacks = fetchedAttacks.filter((attack) => attack.power > 0)
  const finalAttacks = []

  for (const attack of damagingAttacks) {
    if (finalAttacks.length >= attackCount) break
    if (!finalAttacks.some((existing) => existing.name === attack.name)) {
      finalAttacks.push(attack)
    }
  }

  for (const attack of fetchedAttacks) {
    if (finalAttacks.length >= attackCount) break
    if (!finalAttacks.some((existing) => existing.name === attack.name)) {
      finalAttacks.push(attack)
    }
  }

  while (finalAttacks.length < attackCount) {
    finalAttacks.push({
      name: `Golpe ${finalAttacks.length + 1}`,
      power: 10,
      effects: [],
    })
  }

  return finalAttacks.slice(0, attackCount)
}
