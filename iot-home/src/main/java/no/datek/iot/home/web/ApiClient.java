package no.datek.iot.home.web;

import lombok.Setter;
import no.datek.iot.home.web.exception.NotFoundException;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;

@Component
public class ApiClient {

    @Value("${homegate.api.base-url:}")
    @Setter
    private String homeApiEndpoint;

    @Autowired
    KeycloakRestTemplate restTemplate;

    public <T> T get(String path, Class<T> clazz) {
        String url = homeApiEndpoint + path;
        try {
            return restTemplate.getForObject(url, clazz);
        }
        catch (HttpStatusCodeException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new NotFoundException("No " + clazz.getSimpleName() + " found at " + url);
            } else {
                throw new RuntimeException("Unexpected HTTP response code from the API: " + e.getStatusCode() + ". Response body: " + e.getResponseBodyAsString());
            }
        }
        catch (RestClientException e) {
            throw new RuntimeException("Unexpected exception from API: " + e.toString());
        }
    }

}
