#!/usr/bin/env bash

echo "Setting env variables in Heroku: $@"
heroku config:add $@

echo "---"
echo "Committing and pushing changes."
git add .
git commit -m "Heroku deploy."
git push heroku master