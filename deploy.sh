#!/usr/bin/env bash
rsync ./ rs:/var/www/js_jobs_bot --delete -r --exclude=node_modules
ssh rs "
. ~/.nvm/nvm.sh
mv /var/www/js_jobs_bot/prod-config.json /var/www/js_jobs_bot/config.json
cd /var/www/js_jobs_bot/ && npm i && pm2 reload js_jobs_bot
"