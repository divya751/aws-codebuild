package no.datek.iot.home.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

import java.util.Map;
import java.util.UUID;

import static org.springframework.web.context.request.RequestAttributes.SCOPE_REQUEST;

@Slf4j
@Component
class ExceptionSupressingErrorAttributes extends DefaultErrorAttributes {

    @Override
    public Map<String, Object> getErrorAttributes(WebRequest request, boolean includeStackTrace) {
        Map<String, Object> errorAttributes = super.getErrorAttributes(request, includeStackTrace);
        Throwable error = getError(request);
        String errorId = UUID.randomUUID().toString();
        errorAttributes.put("error_id", errorId);
        log.info("Returning error attributes " + errorAttributes + " for error : " + error);

        errorAttributes.remove("exception");
        if (!(error instanceof ClientException)) {
            errorAttributes.put("message", ""); //clear message
        }

        if (error instanceof ClientException) {
            ClientException ex = (ClientException) error;
            if (ex.getErrorCode().isPresent()) {
                errorAttributes.put("error_code", ex.getErrorCode().get());
            }
            request.setAttribute("javax.servlet.error.status_code", ex.getHttpStatusCode(), SCOPE_REQUEST);
            errorAttributes.put("status", ex.getHttpStatusCode());
            errorAttributes.put("error", ex.getHttpStatusMessage());
        }
        errorAttributes.put("error_id", errorId);
        return errorAttributes;
    }

}
