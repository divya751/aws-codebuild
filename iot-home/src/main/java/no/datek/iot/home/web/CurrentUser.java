package no.datek.iot.home.web;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static java.util.stream.Collectors.toList;
import static org.apache.commons.collections4.SetUtils.emptyIfNull;
import static org.apache.commons.lang3.StringUtils.substringAfterLast;

@Data
@Builder
public class CurrentUser {
    String username;
    String firstName;
    String lastName;
    String clientId;
    Map<String, Set<String>> clientRoles;

    public boolean hasClientRole(String clientId, String role) {
        return clientRoles != null &&
                clientRoles.get(clientId) != null &&
                clientRoles.get(clientId).contains(role);
    }

    public boolean isPartnerAdmin() {
        return !getPartnerIdAdminAccessFromRoles().isEmpty();
    }

    public List<String> getPartnerIdAdminAccessFromRoles() {
        if (clientRoles == null) {
            return new ArrayList<>();
        }
        return emptyIfNull(clientRoles.get("home-web")).stream()
                .filter(r -> r.startsWith("home-web-admin-partner-"))
                .map(r -> substringAfterLast(r, "home-web-admin-partner-"))
                .collect(toList());
    }

    public boolean isSuperUser() {
        return clientRoles != null && emptyIfNull(clientRoles.get("home-web")).stream()
                .anyMatch(r -> r.equals("home-web-admin-super"));
    }

}
