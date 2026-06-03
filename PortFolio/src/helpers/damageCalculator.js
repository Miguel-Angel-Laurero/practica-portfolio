export function damageCalculator(attack, attacker = {}, target = {}, effectiveness) {
  let attackStat, defenseStat
  if (attack.damageClass === "physical") { 
    attackStat = attacker.stats?.find((s) => s.stat?.name === 'attack')?.base_stat ?? 50
    defenseStat = target.stats?.find((s) => s.stat?.name === 'defense')?.base_stat ?? 50
  } else if (attack.damageClass === "special") {
    attackStat = attacker.stats?.find((s) => s.stat?.name === 'special-attack')?.base_stat ?? 50
    defenseStat = target.stats?.find((s) => s.stat?.name === 'special-defense')?.base_stat ?? 50
  } else {
    console.log("no entro")
    return 0;
  }
  const attackPower = attack.power;

  const level = attacker.level
  // const modifier =  1;
  const modifier = effectiveness;
  console.log(level)

  const rawDamage =
    ((((2 * level) / 5 + 2) * attackPower * (attackStat / Math.max(1, defenseStat))) / 50 + 2) * modifier

  return Math.max(1, Math.round(rawDamage))
}