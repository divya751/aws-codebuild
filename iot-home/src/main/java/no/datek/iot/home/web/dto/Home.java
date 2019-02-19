package no.datek.iot.home.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Home {
    public Address address;
    public Homegate homegate;
}
