#!/bin/bash
set -e
TAG=latest

mvn clean install dockerfile:build -Ddocker.tag=${TAG}
if [ $? -ne 0 ]; then
    echo "Build failed"
    exit $?
fi

docker tag datek/iot-home-web datek/iot-home-web:$TAG  && docker push datek/iot-home-web:$TAG