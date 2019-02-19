export default function environment() {
    const safe4mode = window.location.hostname.indexOf("home-web-test.homegate.io") >= 0 || window.location.hostname.indexOf("home-web.homegate.io") >= 0;
    const overtureMode = window.location.hostname.indexOf("home-web-overture.homegate.io") >= 0;
    const appBackendMode = window.location.hostname.indexOf("home-web-qa.datek.no") >= 0 || window.location.hostname.indexOf("home-web.elkosmarthome.io") >= 0;
    const elkoQaMode = window.location.hostname.indexOf("home-web-qa.datek.no") >= 0 ;
    const elkoProductionMode = window.location.hostname.indexOf("home-web.elkosmarthome.io") >= 0;
    const hostSuffix = window.location.hostname.indexOf("-overture") >= 0 ? "-overture" :
        window.location.hostname.indexOf("-qa") >= 0 ? "-qa" :
        window.location.hostname.indexOf("-test") >= 0 ? "-test" : '';
    const domain = window.location.hostname.replace(hostSuffix, "").replace("home-web.", "")
    const keycloakRealm = domain == "elkosmarthome.io" ? "ElkoSmartHome" : "homegate"
    return {
        "safe4mode" : safe4mode,
        "overtureMode" : overtureMode,
        "appBackendMode" : appBackendMode,
        "elkoQaMode" : elkoQaMode,
        "elkoProductionMode" : elkoProductionMode,
        "hostSuffix" : hostSuffix,
        "domain" : domain,
        "keycloakRealm" : keycloakRealm
    }
}