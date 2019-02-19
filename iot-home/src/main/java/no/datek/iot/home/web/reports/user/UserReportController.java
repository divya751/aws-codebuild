package no.datek.iot.home.web.reports.user;

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
public class UserReportController {
	private static final DateTimeFormatter LONG_DATE_FORMATTER = DateTimeFormat.forPattern("dd.MM.yyyy HH:mm").withZone(DateTimeZone.forID("CET"));
	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormat.forPattern("dd.MM.yyyy").withZone(DateTimeZone.forID("CET"));

	@Autowired
	CurrentUserService currentUserService;
	@Autowired
	ApiClient apiClient;

	@RequestMapping(value = "/reports/users")
	public void getUserReport(HttpServletResponse response) throws IOException {
		if (!currentUserService.userHasHomeWebRole()) {
			throw new InsufficiendRoleException("Please close browser (or clear cookies) before trying again");
		}

		UserReport report = apiClient.get("/client-specific/home-web/reports/user", UserReport.class);
		String templateFileName = "/user_report_template.xlsx";

		XSSFWorkbook workBook = new XSSFWorkbook(getClass().getResourceAsStream(templateFileName));
		XSSFSheet sheet0 = workBook.getSheetAt(0);
		sheet0.getRow(0).createCell(4).setCellValue("Report generated " + LONG_DATE_FORMATTER.print(new Date().getTime()));
		log.info("Generating excel user report with {} rows", report.getRows().size());

		int rowno = 3;
		for (UserReportRow userRow : report.getRows()) {
			XSSFRow row = sheet0.createRow(rowno++);
			int colno = 0;
			row.createCell(colno++).setCellValue(defaultString(userRow.getHomeId()));
			row.createCell(colno++).setCellValue(defaultString(userRow.getEmail()));
			row.createCell(colno++).setCellValue(defaultString(userRow.getPhoneNumber()));
			row.createCell(colno++).setCellValue(defaultString(userRow.getFirstName()));
			row.createCell(colno++).setCellValue(defaultString(userRow.getLastName()));
			row.createCell(colno++).setCellValue(defaultString(userRow.getRole()));
			row.createCell(colno++).setCellValue(userRow.getValidFrom() != null ? LONG_DATE_FORMATTER.print(userRow.getValidFrom().getTime()) : "");
			row.createCell(colno++).setCellValue(userRow.getValidTo() != null ? LONG_DATE_FORMATTER.print(userRow.getValidTo().getTime()) : "");
		}

		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		response.setHeader("Content-Disposition", "filename=homegate_user_report_" + DATE_FORMATTER.print(new DateTime()) + ".xlsx");
		ServletOutputStream out = response.getOutputStream();
		workBook.write(out);
		out.flush();
	}
}