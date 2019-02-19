#!/bin/bash
set -e

URL=http://localhost:8080

HOME_ID=57d2bc2c3b0c6747dd707ded

echo "Adding devices to home ${HOME_ID} ..."
curl "${URL}/homes/${HOME_ID}/devices" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'", "serialNo": "111111111" ,"room":"Living room","floor":"First floor","name" : "Door Contact", "location" : "Hallway","vendor" : "ClimaxTechnology","model": "DC_00.00.03.02TC","firmwareVersion": "1.3.3","softwareVersion": "1.9.6"}'
curl "${URL}/homes/${HOME_ID}/devices" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'", "serialNo": "222222222" ,"room":"Living room","floor":"First floor","name" : "Hallway PIR","location" : "Hallway","vendor" : "ClimaxTechnology","model": "IR_00.00.03.02TC","firmwareVersion": "1.0.0","softwareVersion": "1.0.0"}'
curl "${URL}/homes/${HOME_ID}/devices" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'", "serialNo": "333333333" ,"room":"Living room","floor":"First floor","name" : "Keypad","location" : "Hallway","vendor" : "ClimaxTechnology","model": "KPT29_00.00.03.04TC","firmwareVersion": "1.2.3","softwareVersion": "1.2.3"}'
curl "${URL}/homes/${HOME_ID}/devices" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'", "serialNo": "444444444" ,"room":"Living room","floor":"First floor","name" : "Siren","location" : "Kitchen","vendor" : "ClimaxTechnology","model": "SR-15ZBS","firmwareVersion": "1.2.3","softwareVersion": "1.2.3"}'
echo "Added devices to home"
echo

echo "Adding alerts to home ${HOME_ID} ..."
curl "${URL}/homes/${HOME_ID}/alerts" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'","homegateId" : "'${GATEWAY_ID}'","deviceId" : "111111111","type" : "intrusion","timestamp": "2016-01-20T08:29:53+0000"}'
curl "${URL}/homes/${HOME_ID}/alerts" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'","homegateId" : "'${GATEWAY_ID}'","deviceId" : "222222222","type" : "intrusion","timestamp": "2016-01-20T08:22:13+0000"}'
curl "${URL}/homes/${HOME_ID}/alerts" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'","homegateId" : "'${GATEWAY_ID}'","deviceId" : "333333333","type" : "lowBattery","timestamp": "2016-01-20T08:12:45+0000"}'
curl "${URL}/homes/${HOME_ID}/alerts" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'","homegateId" : "'${GATEWAY_ID}'","deviceId" : "111111111","type" : "zoneDisconnected","timestamp": "2016-01-20T08:08:12+0000"}'
curl "${URL}/homes/${HOME_ID}/alerts" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'","homegateId" : "'${GATEWAY_ID}'","deviceId" : "111111111","type" : "lowBattery","timestamp": "2016-01-20T08:04:13+0000"}'
curl "${URL}/homes/${HOME_ID}/alerts" -i -X POST -H 'Content-Type: application/hal+json' -d '{"homeId" : "'${HOME_ID}'","homegateId" : "'${GATEWAY_ID}'","deviceId" : "111111111","type" : "acError","timestamp": "2016-01-20T08:02:31+0000"}'
echo "Added alerts to home"
echo