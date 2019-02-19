package no.datek.iot.home.web;

import org.keycloak.KeycloakPrincipal;
import org.keycloak.representations.AccessToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Component
public class CurrentUserService {

    public CurrentUser getLoggedInUser() {
        if (SecurityContextHolder.getContext() == null || SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new IllegalStateException("No logged in user present!");
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof KeycloakPrincipal) {
            AccessToken token = ((KeycloakPrincipal) principal).getKeycloakSecurityContext().getToken();
            CurrentUser user = CurrentUser.builder()
                    .username(token.getPreferredUsername())
                    .firstName(token.getGivenName())
                    .lastName(token.getFamilyName())
                    .clientId(token.getIssuedFor())
                    .clientRoles(getClientRoles(token))
                    .build();
            return user;
        }
        else {
            throw new IllegalStateException("Unexpected principal: " + principal);
        }
    }

    public String getLoggedInUsername() {
        return getLoggedInUser().getUsername();
    }

    public boolean userHasHomeWebRole() {
        return  getLoggedInUser().hasClientRole("home-web", "home-web-admin-super") ||
                getLoggedInUser().hasClientRole("home-web", "home-web-admin-default") ||
                getLoggedInUser().isPartnerAdmin();
    }

    private Map<String, Set<String>> getClientRoles(AccessToken token) {
        Map<String, Set<String>> result = new LinkedHashMap<>();
        token.getResourceAccess().entrySet().forEach(client -> {
            result.put(client.getKey(), client.getValue().getRoles());
        });
        return result;
    }
}
