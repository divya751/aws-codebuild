package no.datek.iot.home.web.reports.user;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class UserReportRow {
    String homeId;
    String email;
    String phoneNumber;
    String firstName;
    String lastName;
    String role;
    Date validFrom;
    Date validTo;
}