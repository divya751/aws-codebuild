import titleCaseObjectKeys from './titleCaseObjectKeys'

export default function ensureEventColumns(list) {
    if (!list) {
        return;
    }
    for (const obj of list) {
        if (!obj.createdAt) obj.createdAt = "";
        if (!obj.drn) obj.drn = "";
        if (!obj.homeId) obj.homeId = "";
        if (!obj.homegateId) obj.homegateId = "";
        if (!obj.deviceId) obj.deviceId = "";
        if (!obj.deviceIndex) obj.deviceIndex = "";
        if (!obj.deviceName) obj.deviceName = "";
        if (!obj.deviceRoom) obj.deviceRoom = "";
        if (!obj.deviceFloor) obj.deviceFloor = "";
        if (!obj.deviceProductType) obj.deviceProductType = "";
        if (!obj.endpointId) obj.endpointId = "";
        if (!obj.clusterId) obj.clusterId = "";
        if (!obj.attributeId) obj.attributeId = "";
        if (!obj.type) obj.type = "";
        if (!obj.message) obj.message = "";
        if (!obj.actionId) obj.actionId = "";
        if (!obj.resource) obj.resource = "";
        if (!obj.changeset) obj.changeset = "";
        if (!obj.userId) obj.userId = "";
        if (!obj.userIndex) obj.userIndex = "";
        if (!obj.userFirstName) obj.userFirstName = "";
        if (!obj.userLastName) obj.userLastName = "";
        if (!obj.status) obj.status = "";
        if (!obj.systemMessage) obj.systemMessage = "";
        if (!obj.props) obj.props = {};
    }
}