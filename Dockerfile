#FROM ubuntu:14.04
FROM maven:3.6.0-jdk-8


ENV MAVEN_VERSION 3.5.0

VOLUME /var/lib/maven

# Node related
# ------------

RUN echo "# Installing Nodejs" && \
    echo "######### Maven version :" && \
    mvn -v && \
    echo "######### Java version :" && \
    java -version && \
    curl -sL https://deb.nodesource.com/setup_4.x | bash - && \
    apt-get install nodejs build-essential -y && \
    echo "######### NPM version :" && \
    npm -v && \
    npm set strict-ssl false && \
#    npm install -g npm@latest && \
    npm install -g bower grunt grunt-cli && \
    npm cache clear -f && \
    npm install -g n && \
    n stable
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY iot-home/* /usr/src/app/

#RUN cd /usr/src/app/ && \
#    ls -ltra && \
#    pwd && \
#    sh -x upgrade_docker.sh && \
#    echo "I am done! Thanks."


###CMD ["python","flask-app/hello.py"]
###  CMD php-fpm -d variables_order="EGPCS" && (tail -F /var/log/nginx/access.log &) && exec nginx -g "daemon off;"
