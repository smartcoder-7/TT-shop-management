#!/usr/bin/env bash

echo "🚀 Deploying to Production."
git add .
git commit -m "Trigger production deploy."
git push heroku-pingpod master