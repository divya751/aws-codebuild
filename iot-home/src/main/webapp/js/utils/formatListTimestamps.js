import moment from 'moment-timezone'

export default function formatListTimestamps(lists, timestampFields) {
    if (!lists) {
        return undefined
    }
    for (const list of lists) {
        if (!list) {
            continue
        }
        for (const obj of list) {
            for (const timestampField of timestampFields) {
                if (obj[timestampField]) {
                    obj[timestampField] = moment(obj[timestampField]).tz("Europe/Berlin").format('DD.MM.YYYY HH:mm')
                }
            }
        }
    }
}