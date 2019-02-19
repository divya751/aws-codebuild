package no.datek.iot.home.web.reports.billing;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class BillingReportRow {
    String partnerId;
    String partnerName;
    String serialNo;
    String connectionStatus;
    Date lastActivityAt;
    String simIccid;
    String homeId;
    Date homeCreatedAt;
    String name;
    String street;
    String street2;
    String postalCode;
    String city;
    String country;
    int amountConnectedDevices;
    int amountActiveUsers;
    int amountContacts;
    String homeReadyStatus;
    String transnummer;
    String kuisAbonnentnummer;
}


