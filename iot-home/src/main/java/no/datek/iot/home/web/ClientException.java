package no.datek.iot.home.web;

import java.util.Optional;

public class ClientException extends RuntimeException {

    public ClientException(String message) {
        super(message);
    }

    /** May be overridden */
    public Optional<String> getErrorCode() {
        return Optional.empty();
    }

    /** May be overridden */
    public int getHttpStatusCode() {
        return 400;
    }

    /** May be overridden */
    public String getHttpStatusMessage() {
        return "Bad Request";
    }
}
