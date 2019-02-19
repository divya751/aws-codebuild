import titleCaseObjectKeys from './titleCaseObjectKeys'
import ensureEventColumns from './ensureEventColumns'

export default function joinDeviceData(home, rows, addEventColumns = false) {
    if (!home || !rows) {
        return undefined
    }

    if (addEventColumns) {
        ensureEventColumns(rows);
    }

    return rows.map(row => {
        if (row.userFirstName) {
            row.userFullName = row.userFirstName + " " + (row.userLastName ? row.userLastName : "");
        }

        const rowTitleCase = titleCaseObjectKeys(row, {})
        if (!home.devices) {
            return rowTitleCase
        }
        let devices = home.devices.filter(device => device.serialNo === row["deviceId"]);
        if (devices.length === 0) {
            return rowTitleCase
        }
        const customMappings = {
            deviceId: "Device serial no",
            productType: "Product type",
            room: "Room",
            floor: "Floor"
        };
        const defaultPrefix = "Device ";
        const deviceTitleCase = titleCaseObjectKeys(devices[0], customMappings, defaultPrefix)
        return Object.assign(rowTitleCase, deviceTitleCase) //merge
    })
}