package no.datek.iot.home.web;

import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import no.datek.iot.home.web.dto.UserInfo;
import no.datek.iot.home.web.exception.NotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

import static org.apache.commons.collections4.ListUtils.emptyIfNull;
import static org.apache.commons.lang3.StringUtils.defaultString;
import static org.springframework.util.StringUtils.hasText;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@Slf4j
public class ApiResource {

	@Value("${homegate.api.base-url:}")
	@Setter
	private String homeApiEndpoint;

	@Autowired
	KeycloakRestTemplate restTemplate;

	@Autowired
	CurrentUserService currentUserService;

	@RequestMapping(value = "/api/userInfo", method = GET)
	public UserInfo getUserInfo() throws IOException {
		CurrentUser loggedInUser = currentUserService.getLoggedInUser();
		return UserInfo.builder()
				.fullName(loggedInUser.getFirstName() + " " + loggedInUser.getLastName())
				.username(loggedInUser.getUsername())
				.superUser(loggedInUser.isSuperUser())
				.build();
	}

	@RequestMapping(value = "/api/**", method = GET)
	public @ResponseBody String restProxyGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String targetResource = StringUtils.substringAfter(request.getRequestURI(), "/api/");
		if (hasText(request.getQueryString())) {
			targetResource += "?" + request.getQueryString();
		}
		return restProxy(targetResource, request, response, null);
	}

	@RequestMapping(value = "/api/**", method = { PATCH, POST, DELETE })
	public @ResponseBody String restProxyPatch(HttpServletRequest request, HttpServletResponse response, @RequestBody(required = false) Map requestBody) throws IOException {
		String targetResource = StringUtils.substringAfter(request.getRequestURI(), "/api/");
		return restProxy(targetResource, request, response, requestBody);
	}

	public String restProxy(String targetResource, HttpServletRequest request, HttpServletResponse response, Map requestBody) throws IOException {
		if (!currentUserService.userHasHomeWebRole()) {
			throw new InsufficiendRoleException("Please close browser (or clear cookies) before trying again");
		}
		Validate.notBlank(homeApiEndpoint, "Please set homegate.api.base-url property.");

		response.addHeader("Cache-Control", "no-store");
		String method = request.getMethod().toUpperCase();
		log.info("Request user: " + currentUserService.getLoggedInUsername() + ", URI: " + request.getRequestURI() + "?" + defaultString(request.getQueryString()) + ", method: " + method);

		String url = homeApiEndpointWithTrailingSlash() + targetResource;
		try {
			ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.valueOf(method), new HttpEntity<Object>(requestBody), String.class);
			if (!exchange.getStatusCode().is2xxSuccessful()) {
				throw new HttpClientErrorException(exchange.getStatusCode());
			}
			copyHeader("Location", response, exchange);
			return exchange.getBody();
		}
		catch (HttpClientErrorException e) {
			if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
				log.warn("Home not found: " + url);
				throw new NotFoundException("Home not found");
			}
			log.error("Unable to fetch API resource: " + url + " (exception: " + e.toString() + ")");
			throw e;
		}
	}

	private void copyHeader(String headerName, HttpServletResponse response, ResponseEntity<String> exchange) {
		emptyIfNull(exchange.getHeaders().get(headerName)).forEach(header -> response.addHeader(headerName, header));
	}

	private String homeApiEndpointWithTrailingSlash() {
		return homeApiEndpoint.endsWith("/") ? homeApiEndpoint : homeApiEndpoint + "/";
	}
}