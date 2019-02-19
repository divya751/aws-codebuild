import React, { Component, PropTypes } from 'react'
import HomeDetails from '../components/HomeDetails.jsx'
import $ from 'jquery'
import isNumeric from 'is-numeric'
import sleep from 'sleep-promise'
import AlertContainer from 'react-alert'
import formatDeviceOnline from "../utils/formatDeviceOnline";
import addExtraDeviceRootFields from "../utils/addExtraDeviceRootFields";

const homeFetchingState = {
  isFetchingHome: true,
  isFetchingAlerts: true,
  isFetchingEvents: true,
  isFetchingActions: true,
  homeNotFound: false
}

class HomeDetailsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = homeFetchingState
    this.updatePin = this.updatePin.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.deleteContact = this.deleteContact.bind(this)
    this.identifyDevice = this.identifyDevice.bind(this)
    this.readSoftwareVersion = this.readSoftwareVersion.bind(this)
    this.readFirmwareVersion = this.readFirmwareVersion.bind(this)
    this.readZclAttribute = this.readZclAttribute.bind(this)
    this.bypassDevice = this.bypassDevice.bind(this)
    this.fetchHome = this.fetchHome.bind(this)
    this.transformHome = this.transformHome.bind(this)
    this.disconnectDevice = this.disconnectDevice.bind(this)
    this.deleteDevice = this.deleteDevice.bind(this)
    this.deleteHome = this.deleteHome.bind(this)
    this.sendRequest = this.sendRequest.bind(this)
    this.pollEvents = this.pollEvents.bind(this)
    this.homegateScan = this.homegateScan.bind(this)
    this.homegatePing = this.homegatePing.bind(this)
    this.uploadLogs = this.uploadLogs.bind(this)
    this.enableGatewayWeb = this.enableGatewayWeb.bind(this)
    this.rebootCoordinator = this.rebootCoordinator.bind(this)
    this.disableGatewayWeb = this.disableGatewayWeb.bind(this)
    this.upgradeGatewaySoftware = this.upgradeGatewaySoftware.bind(this)
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'light',
      time: 40000,
      transition: 'fade'
    }
  }

  componentDidMount() {
    this.fetchHome(this.props.params.homeId)
  }

  transformHome(home) {
    if (home && home.devices) {
      home.devices
          .map(d => formatDeviceOnline(d))
          .map(d => addExtraDeviceRootFields(d))
    }
    return home
  }

  fetchHome(homeId, noSpinner) {
    if (!noSpinner) {
      this.setState(homeFetchingState)
    }

    $.getJSON("/api/homes/" + homeId)
      .done((home => this.setState({home: this.transformHome(home), isFetchingHome: false})).bind(this))
      .fail(((data) => this.setState({home: {}, homeNotFound: (data.status == 404), isFetchingHome: false, fetchHomesFailed: (data.status != 404)})).bind(this))

    const alertsUrl = "/api/homes/" + homeId + "/alerts";
    $.getJSON(alertsUrl)
      .done((data => this.setState({
        alerts: (data._embedded ? data._embedded.alertResources : []),
        isFetchingAlerts: false,
        rawAlertsUrl: alertsUrl
      })).bind(this))

    const eventsUrl = "/api/homes/" + homeId + "/events?page=0&size=100&from=20160101T000000Z&to=20990101T000000Z";
    $.getJSON(eventsUrl)
      .done((data => this.setState({
        events: (data._embedded ? data._embedded.events : []),
        isFetchingEvents: false,
        rawEventsUrl: eventsUrl
      })).bind(this))

    const actionsUrl = "/api/homes/" + homeId + "/actions?page=0&size=100&from=20160101T000000Z&to=20990101T000000Z";
    $.getJSON(actionsUrl)
      .done((data => this.setState({
        actions: (data._embedded ? data._embedded.actions : []),
        isFetchingActions: false,
        rawActionsUrl: actionsUrl
      })).bind(this))
  }

  componentWillReceiveProps(newProps) {
    if (this.props.params.homeId !== newProps.params.homeId) {
      this.fetchHome(newProps.params.homeId)
    }
  }

  updatePin(homeId, userIndex, pin) {
    this.setState({ updatePinUserIndex: userIndex})

    const params = {
      homeId: homeId,
      url: "/api/homes/" + homeId + "/users/" + userIndex,
      method: "PATCH",
      jsonString: JSON.stringify({pin: pin}),
      displayOperation: "Update PIN",
      displayOperationSuccess: "PIN updated!",
      async: true
    }
    if (!isNumeric(userIndex)) {
      this.msg.error("Please select a user.")
      return;
    }
    if (!isNumeric(pin) || pin.length < 4 || pin.length > 8) {
        this.msg.error("Invalid PIN. Must be between 4 and 8 digits.")
      return;
    }
    this.sendRequest(params)
  }

  deleteUser(home, userIndex, force) {
    if (!force && !confirm("Are you sure you want to delete the user?")) {
      return
    }
    if (!home || !isNumeric(userIndex)) {
      throw "Invalid input: " + home + " / " + userIndex
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/users/" + userIndex,
      method: "DELETE",
      async: true,
      displayOperation: "Delete user",
      displayOperationSuccess: "User deleted!"

    }
    this.sendRequest(params)
  }

  deleteContact(home, contactIndex) {
    if (!confirm("Are you sure you want to delete the contact?")) {
      return
    }
    if (!home || !isNumeric(contactIndex)) {
      throw "Invalid input: " + home + " / " + contactIndex
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/contacts/" + contactIndex,
      method: "DELETE",
      displayOperation: "Delete contact",
      displayOperationSuccess: "Contact deleted!",
      async: true
    }
    this.sendRequest(params)
  }

  deleteDevice(home, deviceSerialNo, force) {
    if (!force && !confirm("Are you sure you want to delete the device?")) {
      return
    }
    if (!home || !deviceSerialNo || deviceSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + deviceSerialNo
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/devices/" + deviceSerialNo,
      method: "DELETE",
      displayOperation: "Delete device",
      displayOperationSuccess: "Device deleted!",
      async: false
    }
    this.sendRequest(params)
  }

  identifyDevice(home, deviceSerialNo) {
    if (!home || !deviceSerialNo || deviceSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + deviceSerialNo
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/devices/" + deviceSerialNo + "/identify",
      method: "POST",
      displayOperation: "Identify device",
      displayOperationSuccess: "Device identified!",
      async: true
    }
    this.sendRequest(params)
  }

  readSoftwareVersion(home, deviceSerialNo) {
    this.readZclAttribute(home, deviceSerialNo, "0x0000", "0x0001", 12000)
    this.readZclAttribute(home, deviceSerialNo, "0x0000", "0x4000", 4000)
  }

  readFirmwareVersion(home, deviceSerialNo) {
    this.readZclAttribute(home, deviceSerialNo, "0x0000", "0x0003", 4000)
  }

  readZclAttribute(home, deviceSerialNo, clusterId, attributeId, successFetchHomeDelay) {
    let endpointId
    for (const device of home.devices || []) {
      if (device.serialNo == deviceSerialNo) {
        for (const endpoint of device.endpoints || []) {
          for (const cluster of endpoint.clusters || []) {
            if (cluster.id == clusterId) {
              endpointId = endpoint.id
            }
          }
        }
      }
    }

    if (isNaN(endpointId)) {
      throw "Device did not have an endpoint with the required cluster and attribute"
    }

    if (!home || !deviceSerialNo || deviceSerialNo.trim().length == 0 || isNaN(endpointId)) {
      throw "Invalid input: " + home + " / " + deviceSerialNo + " / " + endpointId
    }

    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/devices/" + deviceSerialNo + "/endpoints/" + endpointId + "/clusters/" + clusterId + "/attributes/" + attributeId + "/read",
      method: "POST",
      displayOperation: "Read endpoint " + endpointId + " cluster " + clusterId + " attribute " + attributeId,
      displayOperationSuccess: "Attribute read!",
      async: true,
      successFetchHomeDelay: successFetchHomeDelay
    }
    this.sendRequest(params)
  }

  bypassDevice(home, deviceSerialNo) {
    if (!home || !deviceSerialNo || deviceSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + deviceSerialNo
    }
    if (!confirm("Are you sure you want to bypass the device?")) {
        return
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/devices/" + deviceSerialNo + "/bypass",
      method: "POST",
      displayOperation: "Bypass device",
      displayOperationSuccess: "Device bypassed!",
      async: true
    }
    this.sendRequest(params)
  }

  disconnectDevice(home, deviceSerialNo) {
    if (!home || !deviceSerialNo || deviceSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + deviceSerialNo
    }
    if (!confirm("Are you sure you want to disconnect the device?")) {
        return
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/devices/" + deviceSerialNo + "/disconnect",
      method: "POST",
      displayOperation: "Disconnect device",
      displayOperationSuccess: "Device disconnected!",
      async: true
    }
    this.sendRequest(params)
  }

  homegateScan(home, homegateSerialNo) {
    if (!home || !homegateSerialNo || homegateSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + homegateSerialNo
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/homegate/cmd/scan",
      method: "POST",
      displayOperation: "Scan command",
      displayOperationSuccess: "Scan activated",
      async: true
    }
    this.sendRequest(params);
  }

  homegatePing(home, homegateSerialNo) {
    if (!home || !homegateSerialNo || homegateSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + homegateSerialNo
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/homegate/cmd/ping",
      method: "POST",
      displayOperation: "Gateway ping",
      displayOperationSuccess: "Gateway is alive!",
      async: true
    }
    this.sendRequest(params);
  }

  uploadLogs(home, homegateSerialNo) {
    if (!home || !homegateSerialNo || homegateSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + homegateSerialNo
    }

    if (home.homegate.connectionStatus == "backup") {
        if (!confirm("Are you sure you want to upload logs over a GSM (backup) connection? (data rates may apply)")) {
            return
        }
    }
    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/homegate/cmd/uploadLogs",
      method: "POST",
      displayOperation: "Upload logs command",
      displayOperationSuccess: "Upload logs command sent",
      async: true
    }
    this.sendRequest(params);
  }

  disableGatewayWeb(home, homegateSerialNo) {
    if (!confirm("Are you sure you want to disable gateway web?")) {
        return
    }
    if (!home || !homegateSerialNo || homegateSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + homegateSerialNo
    }

    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/homegate/cmd/disableWeb",
      method: "POST",
      displayOperation: "Disable gateway web command",
      displayOperationSuccess: "Disable gateway web command sent",
      async: true
    }
    this.sendRequest(params);
  }

  enableGatewayWeb(home, homegateSerialNo) {
    const verifyOperationInput = prompt("Warning: Are you sure you want to enable gateway web? It should only be used for test-gateways, not in production! Please enter the name of the user that installed the home to confirm (" + home.fullName + ")", "");
    if (verifyOperationInput === "") {
      alert("No name entered. Gateway web will not be enabled.")
      return
    }
    if (!verifyOperationInput) {
      return
    }
    if (verifyOperationInput !== home.fullName) {
      alert("Wrong name. Gateway web will not be enabled.")
      return
    }

    if (!home || !homegateSerialNo || homegateSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + homegateSerialNo
    }

    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/homegate/cmd/enableWeb",
      method: "POST",
      displayOperation: "Enable gateway web command",
      displayOperationSuccess: "Enable gateway web command sent",
      async: true
    }
    this.sendRequest(params);
  }

  rebootCoordinator(home, homegateSerialNo) {
    if (!confirm("Are you sure you want to restart the ZigBee coordinator? (The ZigBee network will be down for a couple of seconds)")) {
        return
    }
    if (!home || !homegateSerialNo || homegateSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + homegateSerialNo
    }

    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/homegate/cmd/rebootCoordinator",
      method: "POST",
      displayOperation: "Restart ZigBee coordinator",
      displayOperationSuccess: "ZigBee coordinator restarted",
      async: true
    }
    this.sendRequest(params);
  }

  upgradeGatewaySoftware(home, homegateSerialNo) {
    if (!home || !homegateSerialNo || homegateSerialNo.trim().length == 0) {
      throw "Invalid input: " + home + " / " + homegateSerialNo
    }

    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId + "/homegate/cmd/updateSoftware",
      method: "POST",
      displayOperation: "Upgrade gateway software request (if new version available)",
      displayOperationSuccess: "Upgrade gateway software requested (if new version available)",
      async: true
    }
    this.sendRequest(params);
  }

  deleteHome(home) {
    const verifyOperationInput = prompt("Warning: Are you sure you want to delete the home? Please enter the name of the user that installed the home to confirm (" + home.fullName + ")", "");
    if (verifyOperationInput === "") {
      alert("No name entered. Home will not be deleted.")
      return
    }
    if (!verifyOperationInput) {
      return
    }
    if (verifyOperationInput !== home.fullName) {
      alert("Wrong name. Home will not be deleted.")
      return
    }

    if (!home) {
      throw "Invalid input: " + home
    }

    const params = {
      homeId: home.homeId,
      url: "/api/homes/" + home.homeId,
      method: "DELETE",
      jsonString: JSON.stringify({deleteDevices: true}),
      displayOperation: "Delete home",
      displayOperationSuccess: "Home deleted!",
      async: false
    }
    this.sendRequest(params)
  }

  sendRequest(params) {
    params.startTime = new Date().getTime();
    this.msg.success("Sending " + params.displayOperation + " ...")
    $.ajax({
        url: params.url,
        method: params.method,
        data: params.jsonString,
        contentType: "application/json; charset=utf-8"
      })
      .done(((data, status, xhr) => {
        if (params.async) {
          const locationHeader = xhr.getResponseHeader("Location");
          if (locationHeader) {
            const relativeLocation = locationHeader.substring(locationHeader.indexOf('/homes'))
            const pollStartTime = Date.now();
            this.pollEvents("/api" + relativeLocation, params, pollStartTime)
          }
          else {
              this.msg.error(params.displayOperation + " failed! Missing location header. HTTP status code: " + status + this.getExecutionTime(params))
              this.fetchHome(params.homeId, true)
          }
        }
        else {
            this.msg.success(params.displayOperationSuccess + this.getExecutionTime(params))
            sleep(params.successFetchHomeDelay || 0).then(() => this.fetchHome(params.homeId, true))
        }
      }).bind(this))
      .fail(((data, status, xhr) => {
          this.msg.error(params.displayOperation + " failed! " + data.responseJSON.error + ". " + data.responseJSON.message + this.getExecutionTime(params))
          this.fetchHome(params.homeId, true)
      }).bind(this))
  }

  pollEvents(url, params, pollStartTime) {
    $.getJSON(url)
      .done((events => {
        const success = events.filter(event => event.status == "success").length > 0;
        const failed = events.filter(event => event.status == "failure").length > 0;
        if (failed) {
            const gwMessages = events.filter(e => e.systemMessage).map(e => e.systemMessage)
            this.msg.error(params.displayOperation + " failed! " + (gwMessages.length > 0 ? ("Gateway message(s): " + gwMessages) : "") + this.getExecutionTime(params))
            this.fetchHome(params.homeId, true)
        }
        else if (success) {
            this.msg.success(params.displayOperationSuccess + this.getExecutionTime(params) + (params.successFetchHomeDelay ? (". Refetching home in " + (params.successFetchHomeDelay / 1000) + " seconds") : ""))
            sleep(params.successFetchHomeDelay || 0).then(() => this.fetchHome(params.homeId, true))
        }
        else {
          if (Date.now() > pollStartTime + 30000) {
              this.msg.error("Timeout! Gateway might be offline. The " + params.displayOperation + " operation might succeed when gateway comes online." + this.getExecutionTime(params))
              this.fetchHome(params.homeId, true)
          }
          else {
            setTimeout(() => this.pollEvents(url, params, pollStartTime), 200)
          }
        }
      }).bind(this))
      .fail(((data, status, xhr) => {
          this.msg.error(params.displayOperation + " failed! " + data.responseJSON.error + ". " + data.responseJSON.message + this.getExecutionTime(params))
          this.fetchHome(params.homeId, true)
      }).bind(this))
  }

  getExecutionTime(params) {
      if (!params || !params.startTime) {
          return "";
      }
      let duration = new Date().getTime() - params.startTime;
      duration = Math.round(duration / 100) * 100
      return " (took " + (duration) + " ms)";
  }

  render() {
    const handlers = {
            updatePinHandler: this.updatePin,
            deleteUserHandler: this.deleteUser,
            deleteContactHandler: this.deleteContact,
            deleteDeviceHandler: this.deleteDevice,
            identifyDeviceHandler: this.identifyDevice,
            readSoftwareVersionHandler: this.readSoftwareVersion,
            readFirmwareVersionHandler: this.readFirmwareVersion,
            bypassDeviceHandler: this.bypassDevice,
            disconnectDeviceHandler: this.disconnectDevice,
            deleteHomeHandler: this.deleteHome,
            homegateScanHandler: this.homegateScan,
            homegatePingHandler: this.homegatePing,
            disableGatewayWebHandler: this.disableGatewayWeb,
            enableGatewayWebHandler: this.enableGatewayWeb,
            upgradeGatewaySoftwareHandler: this.upgradeGatewaySoftware,
            rebootCoordinatorHandler: this.rebootCoordinator,
            uploadLogsHandler: this.uploadLogs
    }
    return (
      <div>
        <AlertContainer ref={alertContainer => this.msg = alertContainer} {...this.alertOptions} />
        <HomeDetails
            data={this.state}
            userInfo={this.props.userInfo}
            handlers={handlers}
        />
      </div>
    )
  }
}

HomeDetailsContainer.propTypes = {
  params: PropTypes.object.isRequired, //path params injected by the react router
  userInfo: PropTypes.object.isRequired //path params injected by the react router
}

export default HomeDetailsContainer
