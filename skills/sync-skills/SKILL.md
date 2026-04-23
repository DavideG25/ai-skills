---
name: sync-skills
description: Sincronizza le skills dal repo GitHub sf-ai-skills nella cartella .claude/ del progetto corrente
---
Esegui in sequenza questi comandi:

cd ..
cd .claude
git fetch github
git checkout github/master -- skills agents settings.json

Se il remote `github` non è configurato, prima lancia:
git remote add github https://github.com/DavideG25/sf-ai-skills.git

Conferma all'utente quali file sono stati aggiornati.
