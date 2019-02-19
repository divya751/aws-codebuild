package no.datek.iot.home.web;

public class InsufficiendRoleException extends ClientException {

    public InsufficiendRoleException(String message) {
        super(message);
    }

    @Override
    public String getHttpStatusMessage() {
        return "Unauthorized (role)";
    }

    @Override
    public int getHttpStatusCode() {
        return 403;
    }
}
