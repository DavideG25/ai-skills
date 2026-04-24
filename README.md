<b> Per importare le skills e agents su un progetto esistente, da terminale lanciare questi comandi: </b>

cd ..

cd .claude

git init

git remote add github https://github.com/DavideG25/sf-ai-skills.git

git fetch github

git checkout github/master -- skills agents settings.json
