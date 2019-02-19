package no.datek.iot.home.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Homegate {
    public String serialNo;
    public String description ;
    public String telNo;
    public String simCardNo;
    public String manufacturer;
    public String model;
    public String firmwareVersion;
    public String wlanApn;
    public String wlanPassword;
}
