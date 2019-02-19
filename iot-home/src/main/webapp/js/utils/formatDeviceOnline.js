export default function formatDeviceOnline(device) {
    if (device && device.online !== true) {
        device.online = "false"
    }
    return device
}