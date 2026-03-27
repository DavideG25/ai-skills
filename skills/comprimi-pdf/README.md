# sf-ai-skills

Raccolta di skill personalizzate per [Claude.ai](https://claude.ai), sviluppate per automatizzare workflow ricorrenti senza dover rispiegare il contesto ogni volta.

## Come si usa una skill

1. Scarica il file `.skill` dalla cartella corrispondente
2. Vai su **claude.ai → Impostazioni → Skills**
3. Carica il file — da quel momento Claude la userà automaticamente quando pertinente

## Skill disponibili

### 📄 `comprimi-pdf`
Comprime PDF pesanti (tipicamente scan firmati digitalmente) riducendone le dimensioni del 50-70%, senza tool online e senza uscire da Claude.

**Si attiva quando:** alléghi un PDF e scrivi "comprimimi", "è troppo grande", "non riesco a mandarlo per email" o simili.

**Come funziona:** re-renderizza ogni pagina come immagine JPEG a qualità 70% e 150dpi. Il contenuto visivo rimane identico; le firme digitali embedded non sono più verificabili criptograficamente — usare l'originale se serve verifica firma.

---

*Repo mantenuto da [@DavideG25](https://github.com/DavideG25)*
