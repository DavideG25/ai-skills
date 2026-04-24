Sincronizza le skills dal repo GitHub sf-ai-skills, preservando le skills locali che non esistono su GitHub.

## Flusso

1. Leggi i nomi delle cartelle in `.claude/skills/` in locale
2. Leggi i nomi delle cartelle in `github/master` sotto `skills/`
3. Identifica le skills locali che NON esistono su GitHub (custom del progetto)
4. Copia quelle cartelle in una cartella temporanea `.claude/skills_temp_backup/`
5. Esegui:
   git fetch github
   git checkout github/master -- skills agents
6. Ripristina le cartelle dalla temp dentro `.claude/skills/`
7. Elimina `.claude/skills_temp_backup/`
8. Conferma all'utente quali skills sono state aggiornate da GitHub e quali erano custom e sono state preservate
