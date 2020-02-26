#!/usr/bin/env bash

echo "🚀 Deploying to Staging."
git add .
git commit -m "Trigger staging deploy."
git push heroku-pingpod-staging master -f