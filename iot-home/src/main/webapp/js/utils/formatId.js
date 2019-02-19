export default function formatId(obj) {
    if (obj && obj.id) {
        return;
    }
    if (obj && obj._links && obj._links.self && obj._links.self.href && obj._links.self.href.indexOf("/") > 0) {
        const href = obj._links.self.href
        obj.id = href.substring(href.lastIndexOf('/') + 1)
    }
}