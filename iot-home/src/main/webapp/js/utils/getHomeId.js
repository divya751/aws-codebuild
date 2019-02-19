export default function getHomeId(home) {
    let fullUrl = ""
    if (home._links.home) {
        fullUrl = home._links.home.href
    }
    else if (home._links.self) {
        fullUrl = home._links.self.href
    }
    else {
        throw "Could not find home ID from: " + home
    }
    const lastSlashPos = fullUrl.lastIndexOf("/")
    return fullUrl.substr(lastSlashPos + 1)
}