// helpers/evolutionHelper.js

export async function fetchEvolutionData(pokemonDetails) {
  try {
    // 1. Obtener species
    const speciesRes = await fetch(pokemonDetails.species.url)
    const species = await speciesRes.json()

    // 2. Obtener cadena de evolución
    const chainRes = await fetch(species.evolution_chain.url)
    const chainData = await chainRes.json()

    // 3. Buscar la evolución del pokémon actual en la cadena
    const nextEvolution = findNextEvolution(chainData.chain, pokemonDetails.name)
    return nextEvolution // { name, minLevel } o null
  } catch {
    return null
  }
}

function findNextEvolution(chainLink, currentName) {
  // Si este nodo es el pokémon actual, devolver su primera evolución por nivel
  if (chainLink.species.name === currentName) {
    for (const next of chainLink.evolves_to) {
      const detail = next.evolution_details?.find(
        (d) => d.trigger?.name === 'level-up' && d.min_level !== null
      )
      if (detail) {
        return { name: next.species.name, minLevel: detail.min_level }
      }
    }
    return null // no evoluciona por nivel
  }

  // Buscar recursivamente en los nodos hijos
  for (const next of chainLink.evolves_to) {
    const found = findNextEvolution(next, currentName)
    if (found) return found
  }

  return null
}