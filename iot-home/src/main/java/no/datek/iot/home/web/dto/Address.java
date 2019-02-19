package no.datek.iot.home.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Address {
    public String street;
    public String zipCode;
    public String city;
    public Location location;
}
