package no.datek.iot.home.web;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.adapters.springsecurity.KeycloakSecurityComponents;
import org.keycloak.adapters.springsecurity.client.KeycloakClientRequestFactory;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.keycloak.adapters.springsecurity.filter.KeycloakAuthenticationProcessingFilter;
import org.keycloak.adapters.springsecurity.filter.KeycloakPreAuthActionsFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

import static org.apache.commons.lang3.StringUtils.defaultString;

@Configuration
@EnableWebSecurity
@ComponentScan(basePackageClasses = KeycloakSecurityComponents.class)
@Slf4j
public class SecurityConfig extends KeycloakWebSecurityConfigurerAdapter {
    static {
        String activeProfile = defaultString(System.getProperty("spring.profiles.active"));
        log.info("Found profiles: " + activeProfile);
        if (activeProfile.contains("elko_production")) {
            log.info("Enabling 'elko_production' keycloak config");
            System.setProperty("keycloak.configurationFile", "classpath:/keycloak-elko_production.json");
        }
        else if (activeProfile.contains("safe4_production")) {
            log.info("Enabling 'safe4_production' keycloak config");
            System.setProperty("keycloak.configurationFile", "classpath:/keycloak-safe4_production.json");
        }
        else if (activeProfile.contains("overture")) {
            log.info("Enabling 'overture' keycloak config");
            System.setProperty("keycloak.configurationFile", "classpath:/keycloak-overture.json");
        }
        else if (activeProfile.contains("qa")) {
            log.info("Enabling 'qa' keycloak config");
            System.setProperty("keycloak.configurationFile", "classpath:/keycloak-qa.json");
        }
        else {
            log.info("Enabling 'qa' keycloak config");
            System.setProperty("keycloak.configurationFile", "classpath:/keycloak-qa.json");
        }
    }

    @Autowired
    Environment environment;

    @Autowired
    KeycloakClientRequestFactory keycloakClientRequestFactory;

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public KeycloakRestTemplate keycloakRestTemplate() {
        return new KeycloakRestTemplate(keycloakClientRequestFactory);
    }

    /**
     * Registers the KeycloakAuthenticationProvider with the authentication manager.
     */
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(keycloakAuthenticationProvider());
    }

    /**
     * Defines the session authentication strategy.
     */
    @Bean
    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        super.configure(http);
        if (environment.acceptsProfiles("https")) {
            log.info("Enabling HTTPS support");
            http = http.requiresChannel().anyRequest().requiresSecure().and();
        }
        http.csrf().disable() //FIXME! Should have CSRF protection
        .authorizeRequests()
                .antMatchers("/bundle.js", "/error", "/info").permitAll()
                .anyRequest().authenticated()
                .and()
                .logout().logoutUrl("/sso/logout").logoutSuccessUrl("/loggedout.html");
    }

    @Bean
    public FilterRegistrationBean keycloakAuthenticationProcessingFilterRegistrationBean(
            KeycloakAuthenticationProcessingFilter filter) {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean(filter);
        registrationBean.setEnabled(false);
        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean keycloakPreAuthActionsFilterRegistrationBean(
            KeycloakPreAuthActionsFilter filter) {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean(filter);
        registrationBean.setEnabled(false);
        return registrationBean;
    }

}