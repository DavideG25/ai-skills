# Roadmap

## Stato attuale

Il progetto è **on hold** per via dei costi delle API Anthropic.
Le API hanno una billing separata rispetto al piano Pro di claude.ai, con un minimo di acquisto non giustificabile per uso prototipale.

---

## Prossimi passi (quando si riprende)

### Priorità alta

- [ ] **Sostituire Claude con Gemini** — Google AI Studio offre un tier gratuito generoso (Gemini 2.0 Flash). Richiede solo una Google API key gratuita e una modifica a `api/structure.ts`
- [ ] **Test end-to-end multi-device** — verificare sync P2P su mobile + desktop in rete reale

### Priorità media

- [ ] **Persistenza server-side** — Vercel KV o Supabase per salvare i contenuti di tutti i partecipanti, non solo il proprio. Necessario se il creatore si disconnette
- [ ] **Riconnessione automatica** — se un peer perde la connessione, tentare reconnect automatico prima di mostrare errore
- [ ] **Export Notion** — integrazione con Notion API per esportare la nota strutturata direttamente in una pagina

### Priorità bassa

- [ ] **PWA icons** — generare icone 192x192 e 512x512 reali (ora mancanti, la PWA usa solo il favicon SVG)
- [ ] **Tema chiaro** — toggle light/dark mode

---

## Architettura attuale

```
smart-notes/
├── api/
│   └── structure.ts      # Vercel Edge Function — proxy Claude API
├── src/
│   ├── components/
│   │   ├── Lobby.tsx         # Form ingresso stanza
│   │   ├── RichEditor.tsx    # Editor TipTap con toolbar
│   │   ├── ParticipantBlock.tsx
│   │   ├── RoomHeader.tsx    # Codice stanza + copia link
│   │   └── StructuredOutput.tsx
│   ├── hooks/
│   │   └── useRoom.ts        # Logica PeerJS completa
│   ├── lib/
│   │   ├── claude.ts         # Chiamata a /api/structure
│   │   └── roomCode.ts       # Generatore codice stanza
│   └── types/index.ts
└── vercel.json
```
