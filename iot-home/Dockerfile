FROM datek/java-base:latest
EXPOSE 8080
ADD target/iot-home-web.jar  .
ENTRYPOINT ["javaw", "-jar", "iot-home-web.jar"]
