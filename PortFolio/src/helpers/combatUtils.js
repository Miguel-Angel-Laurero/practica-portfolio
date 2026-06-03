export function getSpeed(creature) {
  return creature?.stats?.find(s => s.stat.name === 'speed')?.base_stat ?? 0
}

export function playerGoesFirst(activePlayer, activeEnemy) {
  const playerSpeed = getSpeed(activePlayer)
  const enemySpeed = getSpeed(activeEnemy)
  if (playerSpeed === enemySpeed) return Math.random() < 0.5
  return playerSpeed > enemySpeed
}

