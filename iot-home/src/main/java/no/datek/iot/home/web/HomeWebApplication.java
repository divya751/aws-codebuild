package no.datek.iot.home.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.Properties;

@SpringBootApplication
@Slf4j
public class HomeWebApplication {

	public static void main(String[] args) {
		SpringApplication.run(HomeWebApplication.class, args);
	}

	@PostConstruct
	@PreDestroy
	public void printApplicationInfo() throws IOException {
		Properties gitInfo = new Properties();
		if (HomeWebApplication.class.getResourceAsStream("/git.properties") != null) {
			gitInfo.load(HomeWebApplication.class.getResourceAsStream("/git.properties"));
		}
		log.info("Application info: Git commit: " + gitInfo.get("git.commit.id.describe-short") + ", build time: " + gitInfo.get("git.build.time"));
	}

	@Bean
	public TomcatServletWebServerFactory webServerFactory() {
		TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
		factory.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/index.html"));
		return factory;
	}
}