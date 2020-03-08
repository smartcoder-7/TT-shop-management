#!/usr/bin/env bash

echo "🔐 Creating a database backup."

date=$(date '+%Y-%m-%d')

gcloud config set project pingpod-web
gcloud firestore export gs://pingpod-backup/$date
gsutil cp -r gs://pingpod-backup ./backup