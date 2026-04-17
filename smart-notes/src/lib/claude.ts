import type { Participant } from '../types'

export async function structureNotes(
  participants: Participant[],
  apiKey: string,
): Promise<string> {
  const response = await fetch('/api/structure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      participants: participants
        .filter((p) => p.content.trim())
        .map((p) => ({ name: p.name, role: p.role, content: p.content })),
      apiKey,
    }),
  })

  const data = await response.json() as { markdown?: string; error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? `Errore ${response.status}`)
  }

  return data.markdown ?? ''
}
