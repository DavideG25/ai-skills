const ADJECTIVES = ['swift', 'bright', 'calm', 'bold', 'keen', 'wise', 'fair', 'deep']
const NOUNS = ['moon', 'star', 'wave', 'peak', 'dawn', 'tide', 'grove', 'spark']

export function generateRoomCode(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(Math.random() * 900) + 100
  return `${adj}-${noun}-${num}`
}

export function getRoomUrl(code: string): string {
  return `${window.location.origin}${window.location.pathname}?room=${code}`
}
