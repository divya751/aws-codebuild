package no.datek.iot.home.web.reports.user;

import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class UserReport {

    Date createdAt = new Date();
    List<UserReportRow> rows = new ArrayList<>();

    public void addRow(UserReportRow row) {
        rows.add(row);
    }
}
