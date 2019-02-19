Home web admin application.

Setup
-----
1. mvn clean install

2. Start application
- IDE: HomeWebApplication.java main method with arguments --homegate.api.base-url=http://home-test-api.datek.no/
- Or on the command line: java -jar target/iot-home-web-1.0.0-SNAPSHOT.jar --homegate.api.base-url=http://home-test-api.datek.no/

To enable hot reload of application / css
-----
1. Install npm
- OS X: brew install npm
- Windows: Download and install

2. Start Application main method (runs on port 9000)
3. Run `./start.sh` (runs webpack dev server on port 3000)
4. Open application at localhost:9000 to log in (enable an OAuth handshake / redirect)
5. Open application at localhost:3000 (/api requests are proxied to port 9000 Spring boot).

To enable semi-hot reload of application / css without using npm dev server
-----
1. Start Application main method in DEBUG mode(runs on port 9000)
2. Run `./watch.sh` (runs webpack on changed files)
3. Open application at localhost:9000
4. On changed .js or .css file, wait for webpack watch build and then reload classes in server (CMD + F9 in Intellij)

Deploy to production (docker cloud)
----
Build image: `mvn clean install docker:build`
Run image locally `docker run datek/iot-home-web -p 8080:8080`
Deploy to production - Docker cloud:
1. Build image (see above) and upload image to docker hub `docker push datek/iot-home-web`
2. Redeploy application in docker cloud

If you cannot build or push the docker image (when changing IP address of your development machine), run
`docker-machine restart && eval "$(docker-machine env default)"`
This will reset the IP address of the boot2docker instance in your VirtualBox.