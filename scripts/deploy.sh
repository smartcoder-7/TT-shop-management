#!/usr/bin/env bash

echo "🚀 Deploying to Heroku."
git add .
git commit -m "Heroku deploy."
git push heroku master