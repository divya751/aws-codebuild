export default function addExtraDeviceRootFields(device) {
    if (device) {
        for (const endpoint of device.endpoints || []) {
            for (const cluster of endpoint.clusters || []) {
                if (cluster.id == "0x0000") {
                    for (const attribute of cluster.attributes || []) {
                        if (attribute.id == "0x4000") {
                            if (!device.softwareVersion || device.softwareVersion == "0" || device.softwareVersion == "") {
                                device.softwareVersion = attribute.value
                            }
                            else {
                                device.softwareVersion = device.softwareVersion + " (" + attribute.value + ")"
                            }
                            return device
                        }
                    }
                }
            }
        }
    }
    return device
}