#!/usr/bin/env bash
rsync ./ rs:/var/www/js_jobs_bot --delete -r --exclude=node_modules
ssh rs "
. ~/.nvm/nvm.sh
cd /var/www/js_jobs_bot/
mv prod-config.json config.json
npm i --production && pm2 restart processes.json
"
