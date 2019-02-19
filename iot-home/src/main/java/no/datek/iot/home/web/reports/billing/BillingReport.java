package no.datek.iot.home.web.reports.billing;

import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class BillingReport {

    Date createdAt = new Date();
    List<BillingReportRow> rows = new ArrayList<>();

    public void addRow(BillingReportRow row) {
        rows.add(row);
    }
}
