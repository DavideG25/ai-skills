import type { Participant } from '../types'

export async function structureNotes(
  participants: Participant[],
  apiKey: string,
): Promise<string> {
  const blocks = participants
    .filter((p) => p.content.trim())
    .map((p) => `### ${p.name} (${p.role})\n${p.content}`)
    .join('\n\n')

  const prompt = `Sei un assistente che struttura appunti collaborativi di riunione.

Hai ricevuto i blocchi di note dei partecipanti:

${blocks}

Produci una nota strutturata in Markdown con:
1. **Titolo** della riunione (inferito dal contenuto)
2. **Sommario** (2-3 frasi)
3. **Punti chiave** (bullet list)
4. **Action items** (con owner e deadline se presenti, altrimenti solo descrizione)

Rispondi SOLO con il Markdown, senza testo extra.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Claude API error: ${response.status} ${err}`)
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>
  }
  return data.content[0]?.text ?? ''
}
