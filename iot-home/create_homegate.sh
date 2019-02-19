#!/bin/bash
set -e

URL=http://localhost:8080
GATEWAY_SERIAL_NO="abfe1234ff" #non-existing gateway

echo "Creating gateway ..."
GATEWAY_ID=$(curl "${URL}/homegates" -i -s -X POST -H 'Content-Type: application/hal+json' -d '{"vendor" : "Datek","wlanApn" : "datek-guest",
               "description" : "Test3","simIccid" : "91919191919111","model" : "1.1","firmwareVersion" : "3.42","telNo" : "+4792001012","serialNo" : "'${GATEWAY_SERIAL_NO}'"}' | grep Location | awk -F "/" '{print $NF}' | tr -d '\n' | tr -d '\r' )
echo "Created gateway: $GATEWAY_ID"
echo
