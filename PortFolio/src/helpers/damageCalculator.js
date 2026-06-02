export function damageCalculator(attackPower, attacker = {}, target = {}) {
  const attackStat = attacker.stats?.find((s) => s.stat?.name === 'attack')?.base_stat ?? 50
  const defenseStat = target.stats?.find((s) => s.stat?.name === 'defense')?.base_stat ?? 50

  const level = 10
  const modifier = 1

  const rawDamage =
    ((((2 * level) / 5 + 2) * attackPower * (attackStat / Math.max(1, defenseStat))) / 50 + 2) * modifier

  return Math.max(1, Math.round(rawDamage))
}