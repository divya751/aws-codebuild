#!/bin/bash
set -e

URL=http://localhost:8080
GATEWAY_ID="579b4fdff148f0f3af6f733a"

echo "Creating home ..."
HOME_ID=$(curl "${URL}/homes" -i -s -X POST -H 'Content-Type: application/hal+json' -d '{"firstName" : "John","lastName" : "Doe","address" : {"zipCode" : "2007","country" : "NO","city" : "Kjeller","street" : "Testveien 6","location" : {"latitude" : "59.9547295","longitude" : "11.0444881"}},
  "emergencyDoorCode" : "9911", "pinCode" : "1234", "timeZone" : "Europe/Oslo","verificationPassword" : "Test codeword", "props" : {"homegateIconId" : "icons/bigHouse"}}' | grep Location | awk -F "/" '{print $NF}' | tr -d '\n' | tr -d '\r')
echo "Created home: ${HOME_ID}"
echo

echo "Adding homegate ${GATEWAY_ID} to home ${HOME_ID} ..."
curl "${URL}/homes/${HOME_ID}/homegate/${GATEWAY_ID}" -i -X PATCH -H 'Content-Type: application/hal+json' -d '{ "vendor":"Datek", "wlanApn":"datek-guest", "description":"Test3", "simIccid":"91919191919111", "model":"1.1", "firmwareVersion":"3.42", "telNo":"+4792001012", "serialNo":"abfe1234ff"}'
echo "Added homegate to home"
echo


