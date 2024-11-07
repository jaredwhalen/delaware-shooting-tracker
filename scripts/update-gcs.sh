#!/usr/bin/env sh

set -e

CDN_AUTH=$(echo $CDN_AUTH | base64 --decode)

CDN_SPACE="gs://delaware-online/datasets"
PUBLIC_PATH="https://www.gannett-cdn.com/delaware-online/datasets"
CDN_PATH="https://$CDN_AUTH@www.gannett-cdn.com/delaware-online/datasets"

PROJECT="delaware-shootings"
FILENAME="shootings.csv"

curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -L "https://www.googleapis.com/drive/v3/files/15l4G2w4PD4RRJLozI9c9ma0sexXYF4kv?alt=media&key=AIzaSyCmo9e2erA8mwwIXl5NGLTxsHEin8JajNQ" -o "scripts/$FILENAME"

gsutil cp "scripts/$FILENAME" "$CDN_SPACE/$PROJECT"
gsutil acl set public-read "$CDN_SPACE/$PROJECT"

curl -X PURGE --user "$CDN_AUTH" "$PUBLIC_PATH/$PROJECT"
