#!/usr/bin/env bash

echo "Setting env variables in Heroku: ${1}\n"
heroku config:add ${1}

echo "Committing and pushing changes.\n"
git add .
git commit -m "Heroku deploy."
git push heroku master