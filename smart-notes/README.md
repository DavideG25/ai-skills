# Smart Notes

PWA collaborativa per prendere note in riunione con strutturazione AI.

## Stack

- React + TypeScript + Vite (PWA installabile)
- TipTap — editor rich text (grassetto, evidenziazione, sottolineatura)
- PeerJS — sync real-time P2P tra partecipanti
- Claude API — strutturazione automatica delle note in Markdown
- Vercel Edge Functions — proxy per le chiamate API

## Funzionalità

- Crea una stanza con codice condivisibile (link o codice diretto)
- Ogni partecipante scrive nel proprio blocco rich text, visibile in tempo reale agli altri
- Il creatore preme "Struttura note" → Claude produce titolo, sommario, punti chiave e action items
- L'output è visibile a tutti e copiabile in Markdown
- Contenuto e sessione persistiti in localStorage (sopravvive al reload)
- PWA installabile su mobile e desktop

## Setup

### Prerequisiti

- Node.js 18+
- Account Vercel
- Anthropic API key con crediti attivi

### Sviluppo locale

```bash
cd smart-notes
npm install
npm run dev
```

### Deploy su Vercel

1. Importa il repo su Vercel
2. Imposta **Root Directory**: `smart-notes`
3. Aggiungi la variabile d'ambiente:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Deploy

## Stato del progetto

> ⚠️ **Progetto on hold**
>
> Il progetto è funzionante ma attualmente in pausa per via dei costi delle API Anthropic.
> Il piano Pro di claude.ai **non include** l'accesso alle API — richiedono una billing separata con un minimo di acquisto crediti non conveniente per uso personale/prototipale.
>
> Vedi `ROADMAP.md` per le alternative pianificate.
