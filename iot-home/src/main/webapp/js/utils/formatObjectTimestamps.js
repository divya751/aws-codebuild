import moment from 'moment-timezone'
import objectPath from 'object-path'

export default function formatObjectTimestamps(obj, timestampPaths) {
    if (!obj) {
        return undefined
    }
    for (const path of timestampPaths) {
        if (!path) {
            continue
        }
        let value = objectPath.get(obj, path);
        if (value && value.indexOf("T") > 0) {
            value = moment(value).tz("Europe/Berlin").format('DD.MM.YYYY HH:mm')
            objectPath.set(obj, path, value)
        }
    }
}