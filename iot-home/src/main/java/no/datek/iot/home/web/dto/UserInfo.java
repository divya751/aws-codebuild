package no.datek.iot.home.web.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInfo {
    String fullName;
    String username;
    boolean superUser;
}
