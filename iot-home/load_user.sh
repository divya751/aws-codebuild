#!/bin/bash
set -e

URL=http://localhost:8080
HOME_ID=57761c83608a55f2b3f9e4ee
echo "Adding users to home ${HOME_ID} ..."
curl "${URL}/homes/${HOME_ID}/users" -i -X POST -H 'Content-Type: application/hal+json' -d '{"firstName" : "Espen","lastName" : "Westgaard","role" : "master","pin" : "3322","active" : "true",
  "validFrom" : "2015-11-16T01:00:00Z","email" : "christian@datek.no","validTo" : "2099-11-16T01:00:00Z","props" : {"userIcon" : "zzz"}}'
echo "Users added to home"
echo

echo "Home ID: $HOME_ID"
