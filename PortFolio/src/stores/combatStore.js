// Idea de lo que irá en tu estado
state: () => ({
  player: { hp: 100, maxHp: 100, shield: 0, energy: 3 },
  enemy: { name: 'Orco Gruñón', hp: 80, maxHp: 80, intent: 'attack' },
  currentTurn: 'player', // 'player' o 'enemy'
  logs: []
})