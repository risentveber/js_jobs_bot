#!/usr/bin/env bash
rsync ./ rs:/var/www/js_jobs_bot --delete -r --exclude=node_modules
