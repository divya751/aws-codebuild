package no.datek.iot.home.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
public class SimpleErrorController extends AbstractErrorController {

    ExceptionSupressingErrorAttributes errorAttributes;

    @Autowired
    public SimpleErrorController(ExceptionSupressingErrorAttributes errorAttributes) {
        super(errorAttributes);
        this.errorAttributes = errorAttributes;
    }

    @Override
    public String getErrorPath() {
        return "/error";
    }

    @RequestMapping(value = "/error", produces = "application/json")
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request, WebRequest webRequest) {
        Map<String, Object> body = this.errorAttributes.getErrorAttributes(webRequest, false);
        HttpStatus status = getStatus(request);
        return new ResponseEntity<>(body, status);
    }
}