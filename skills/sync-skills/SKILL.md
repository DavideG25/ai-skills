Sincronizza le skills, gli agenti e i permessi dal repo GitHub sf-ai-skills, preservando le customizzazioni locali.

## Flusso

1. Leggi i nomi delle cartelle in `.claude/skills/` e dei file in `.claude/agents/` in locale
2. Leggi i nomi delle cartelle/file in `github/master` sotto `skills/` e `agents/`
3. Identifica skills e agenti locali che NON esistono su GitHub (custom del progetto)
4. Copia quelli in una cartella temporanea `.claude/_temp_backup/`
5. Leggi il `settings.json` locale e salva i permessi custom (quelli non presenti su GitHub)
6. Esegui:
   git fetch github
   git checkout github/master -- skills agents settings.json
7. Ripristina le cartelle/file dalla temp dentro `.claude/skills/` e `.claude/agents/`
8. Merge dei permessi custom salvati al punto 5 dentro il nuovo `settings.json`
9. Elimina `.claude/_temp_backup/`
10. Conferma all'utente quali skills/agenti sono stati aggiornati da GitHub e quali erano custom e sono stati preservati
