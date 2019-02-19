#FROM ubuntu:14.04
FROM maven:3.6.0-jdk-8

MAINTAINER James Dunnam "jamesd1184@gmail.com"

ENV MAVEN_VERSION 3.5.0

VOLUME /var/lib/maven

# Node related
# ------------

RUN echo "# Installing Nodejs" && \
    echo "######### Maven version :" && \
    mvn -v && \
    java -version && \
    echo "######### curl from deb.nodesource.com" && \
    curl -sL https://deb.nodesource.com/setup_4.x | bash - && \
    echo "######## Installing Nodejs buildessential" && \
    apt-get install nodejs build-essential -y && \
    echo "######## npm set strict-ssl false" && \
    npm -v && \
    npm set strict-ssl false && \
#    npm install -g npm@latest && \
    npm install -g bower grunt grunt-cli && \
    npm cache clear -f && \
    npm install -g n && \
    n stable
  ###  CMD php-fpm -d variables_order="EGPCS" && (tail -F /var/log/nginx/access.log &) && exec nginx -g "daemon off;"
CMD echo "I am demo" > a.lst && (cat a.lst) && echo "I am done! Thanks."
