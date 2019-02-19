package no.datek.iot.home.web.reports.billing;

import lombok.extern.slf4j.Slf4j;
import no.datek.iot.home.web.ApiClient;
import no.datek.iot.home.web.CurrentUserService;
import no.datek.iot.home.web.InsufficiendRoleException;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

import static org.apache.commons.lang3.StringUtils.defaultString;

@Controller
@Slf4j
public class BillingReportController {
	private static final DateTimeFormatter LONG_DATE_FORMATTER = DateTimeFormat.forPattern("dd.MM.yyyy HH:mm").withZone(DateTimeZone.forID("CET"));
	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormat.forPattern("dd.MM.yyyy").withZone(DateTimeZone.forID("CET"));

	@Autowired
	CurrentUserService currentUserService;
	@Autowired
	ApiClient apiClient;

	@RequestMapping(value = "/reports/billing")
	public void getBillingReport(HttpServletResponse response) throws IOException {
		if (!currentUserService.userHasHomeWebRole()) {
			throw new InsufficiendRoleException("Please close browser (or clear cookies) before trying again");
		}

		BillingReport report = apiClient.get("/client-specific/home-web/reports/billing", BillingReport.class);
		String templateFileName = "/billing_report_template.xlsx";

		XSSFWorkbook workBook = new XSSFWorkbook(getClass().getResourceAsStream(templateFileName));
		XSSFSheet sheet0 = workBook.getSheetAt(0);
		sheet0.getRow(0).createCell(4).setCellValue("Report generated " + LONG_DATE_FORMATTER.print(new Date().getTime()));
		log.info("Generating excel billing report with {} rows", report.getRows().size());

		int rowno = 3;
		for (BillingReportRow billingRow : report.getRows()) {
			XSSFRow row = sheet0.createRow(rowno++);
			int colno = 0;
			row.createCell(colno++).setCellValue(defaultString(billingRow.getPartnerId()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getPartnerName()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getSerialNo()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getConnectionStatus()));
			row.createCell(colno++).setCellValue(billingRow.getLastActivityAt() != null ? LONG_DATE_FORMATTER.print(billingRow.getLastActivityAt().getTime()) : "");
			row.createCell(colno++).setCellValue(defaultString(billingRow.getSimIccid()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getHomeId()));
			row.createCell(colno++).setCellValue(billingRow.getHomeCreatedAt() != null ? LONG_DATE_FORMATTER.print(billingRow.getHomeCreatedAt().getTime()) : "");
			row.createCell(colno++).setCellValue(defaultString(billingRow.getName()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getStreet()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getStreet2()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getPostalCode()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getCity()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getCountry()));
			row.createCell(colno++).setCellValue(billingRow.getAmountConnectedDevices());
			row.createCell(colno++).setCellValue(billingRow.getAmountActiveUsers());
			row.createCell(colno++).setCellValue(billingRow.getAmountContacts());
			row.createCell(colno++).setCellValue(defaultString(billingRow.getHomeReadyStatus()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getTransnummer()));
			row.createCell(colno++).setCellValue(defaultString(billingRow.getKuisAbonnentnummer()));
		}

		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		response.setHeader("Content-Disposition", "filename=homegate_billing_report_" + DATE_FORMATTER.print(new DateTime()) + ".xlsx");
		ServletOutputStream out = response.getOutputStream();
		workBook.write(out);
		out.flush();
	}
}