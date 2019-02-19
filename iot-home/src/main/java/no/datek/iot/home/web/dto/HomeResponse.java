package no.datek.iot.home.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class HomeResponse {
    public HomeList _embedded;
}
