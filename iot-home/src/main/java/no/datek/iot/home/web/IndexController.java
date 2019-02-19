package no.datek.iot.home.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
public class IndexController {

	@Autowired
	CurrentUserService currentUserService;

	@RequestMapping(value = "/")
	public String index() throws IOException {
		if (!currentUserService.userHasHomeWebRole()) {
		    throw new InsufficiendRoleException("Please close browser (or clear cookies) before trying again");
        }
		return "index.html";
	}
}