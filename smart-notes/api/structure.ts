export const config = { runtime: 'edge' }

interface Participant {
  name: string
  role: string
  content: string
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY non configurata sul server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { participants } = await req.json() as { participants: Participant[] }

  const blocks = participants
    .filter((p) => p.content.trim())
    .map((p) => `### ${p.name} (${p.role})\n${p.content}`)
    .join('\n\n')

  if (!blocks) {
    return new Response(JSON.stringify({ error: 'Nessun contenuto da strutturare' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const prompt = `Sei un assistente che struttura appunti collaborativi di riunione.

Hai ricevuto i blocchi di note dei partecipanti:

${blocks}

Produci una nota strutturata in Markdown con:
1. **Titolo** della riunione (inferito dal contenuto)
2. **Sommario** (2-3 frasi)
3. **Punti chiave** (bullet list)
4. **Action items** (con owner e deadline se presenti, altrimenti solo descrizione)

Rispondi SOLO con il Markdown, senza testo extra.`

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text()
    return new Response(JSON.stringify({ error: `Claude API error: ${anthropicRes.status} ${err}` }), {
      status: anthropicRes.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await anthropicRes.json() as {
    content: Array<{ type: string; text: string }>
  }
  const markdown = data.content[0]?.text ?? ''

  return new Response(JSON.stringify({ markdown }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
