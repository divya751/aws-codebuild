import { Grid, Row, Col, Panel } from 'react-bootstrap'
import React, { Component, PropTypes } from 'react'
import KeyValueList from './KeyValueList.jsx'
import Table from './Table.jsx'
import GridHeader from './GridHeader'
import joinDeviceData from '../utils/joinDeviceData'
import titleCaseObjectKeys from '../utils/titleCaseObjectKeys'
import addExtraDeviceRootFields from '../utils/addExtraDeviceRootFields'
import formatId from '../utils/formatId'
import formatListTimestamps from '../utils/formatListTimestamps'
import formatObjectTimestamps from '../utils/formatObjectTimestamps'
import addColumnsIfMissing from '../utils/addColumnsIfMissing'
import environment from '../utils/environment'
import SetPinForm from './SetPinForm.jsx'
import ActionDropdown from './ActionDropdown.jsx'
import ActionDropdownGriddle from './ActionDropdownGriddle.jsx'
import capitalize from 'string-capitalize'
import sentenceCase from 'sentence-case'

class HomeDetails extends Component {

    render() {
        const superUser = this.props.userInfo && this.props.userInfo.superUser
        const { isFetchingHome, isFetchingEvents, isFetchingAlerts, isFetchingActions, home, events, alerts, actions, homeNotFound, fetchHomesFailed, rawEventsUrl, rawAlertsUrl, rawActionsUrl } = this.props.data

        if (home) {
            home.fullName = (home.firstName || "") + " " + (home.lastName || "")
            if (home.activeProfile && home.activeProfile.mode) {
                home.activeProfile.mode = capitalize(sentenceCase(home.activeProfile.mode))
            }
            formatObjectTimestamps(home, ["activeProfile.modeChangedAt", "homegate.lastActivityAt"])

            if (home.props && !home.props.gatewayLabelId && home.homegate && home.homegate.serialNo) {
                home.props.gatewayLabelId = home.homegate.serialNo
            }
        }

        alerts && alerts.forEach(a => formatId(a))
        const alertData = joinDeviceData(home, alerts)

        let defaultAlertColumns = ["Type", "Device name", "Product type", "Room", "Floor", "Device serial no", "Timestamp"]
        if (environment().appBackendMode) {
            defaultAlertColumns = ["Type", "Device name", "Product type", "Device serial no", "Timestamp"]
        }
        addColumnsIfMissing(alertData, defaultAlertColumns)

        let defaultEventColumns = ["Message", "Device name", "Room", "Device serial no", "User full name", "Created at"]
        if (environment().appBackendMode) {
            defaultEventColumns = ["Message", "Device name", "Device serial no", "User full name", "Created at"]
        }

        events && events.forEach(e => formatId(e))
        const eventData = joinDeviceData(home, events, true)
        addColumnsIfMissing(eventData, defaultEventColumns)

        actions && actions.forEach(a => formatId(a))
        let defaultActionColumns = ["Type", "Device name", "Product type", "Device serial no", "User full name", "Timestamp"]
        const actionData = joinDeviceData(home, actions)
        addColumnsIfMissing(actionData, defaultActionColumns)

        const defaultUserColumns = ["First name", "Last name", "Email", "Role", "Active"]
        if (superUser || environment().overtureMode) {
            defaultUserColumns.push("Action")
        }
        const users = home ? home.users ? home.users.map(user => titleCaseObjectKeys(user)) : [] : []

        const usersColumnMetadata = (superUser || environment().overtureMode) ? [{
            columnName: "Action",
            customComponent: ActionDropdownGriddle,
            home: home,
            actions: [
                {
                    label: "Delete",
                    actionHandler: this.props.handlers.deleteUserHandler,
                    objectIdField: "Index"
                }
            ]
        }] : []
        addColumnsIfMissing(users, defaultUserColumns)

        let defaultDeviceColumns = ["Name", "Product type", "Serial no", "Room", "Floor", "Online", "Software version", "Commission failed at", "Action"]
        if (environment().overtureMode) {
            defaultDeviceColumns = ["Name", "Product type", "Serial no", "Online", "Software version", "Firmware version", "Commission failed at", "Action"]
        }
        else if (environment().appBackendMode) {
            defaultDeviceColumns = ["Name", "Product type", "Serial no", "Online", "Software version", "Commission failed at", "Action"]
        }
        const devices = home ? home.devices ? home.devices.map(device => titleCaseObjectKeys(device)) : [] : []

        const deviceActions = [
            {
                label: "Read Software version",
                actionHandler: this.props.handlers.readSoftwareVersionHandler,
                objectIdField: "Serial no"
            },
            {
                label: "Read Firmware version",
                actionHandler: this.props.handlers.readFirmwareVersionHandler,
                objectIdField: "Serial no"
            },
            {
                label: "Identify",
                actionHandler: this.props.handlers.identifyDeviceHandler,
                objectIdField: "Serial no"
            }
        ]

        if (superUser || environment().overtureMode) {
            deviceActions.push(
                {
                    label: "Delete",
                    actionHandler: this.props.handlers.deleteDeviceHandler,
                    objectIdField: "Serial no"
                }
            )
        }
        if (environment().safe4mode) {
            deviceActions.push(
            {
                label: "Bypass",
                    actionHandler: this.props.handlers.bypassDeviceHandler,
                objectIdField: "Serial no"
            },
            {
                label: "Disconnect",
                    actionHandler: this.props.handlers.disconnectDeviceHandler,
                objectIdField: "Serial no"
            })
        }
        const devicesColumnMetadata = [{
            columnName: "Action",
            customComponent: ActionDropdownGriddle,
            home: home,
            actions: deviceActions
        }]
        addColumnsIfMissing(devices, defaultDeviceColumns)

        const defaultContactColumns = ["Priority", "Name", "Phone", "Email", "Relation"]
        if (superUser) {
            defaultUserColumns.push("Action")
        }
        const contacts = home ? home.contacts ? home.contacts.map(contact => titleCaseObjectKeys(contact)) : [] : []
        const contactsColumnMetadata = superUser ? [{
            columnName: "Action",
            customComponent: ActionDropdownGriddle,
            home: home,
            actions: [
                {
                    label: "Delete",
                    actionHandler: this.props.handlers.deleteContactHandler,
                    objectIdField: "Index"
                }
            ]
        }] : []
        addColumnsIfMissing(contacts, defaultContactColumns)

        formatListTimestamps([alertData, eventData, actionData, devices, contacts, users], ["Timestamp", "Created at", "Device added at", "Updated at", "Valid from"])

        const homegateActions = home && home.homegate ? [
            {
                label: "Ping",
                actionHandler: this.props.handlers.homegatePingHandler,
                object: home.homegate,
                objectIdField: "serialNo"
            },
            {
                label: "Upload logs",
                actionHandler: this.props.handlers.uploadLogsHandler,
                object: home.homegate,
                objectIdField: "serialNo"
            },
            /*{ //TODO: Not working on gateways yet
                label: "Upgrade gateway software",
                actionHandler: this.props.handlers.upgradeGatewaySoftwareHandler,
                object: home.homegate,
                objectIdField: "serialNo"
            },*/
            {
                label: "Restart ZigBee coordinator",
                actionHandler: this.props.handlers.rebootCoordinatorHandler,
                object: home.homegate,
                objectIdField: "serialNo"
            }
        ] : []

        if (superUser && home && home.homegate) {
            homegateActions.push(
                {
                    label: "Scan for devices",
                    actionHandler: this.props.handlers.homegateScanHandler,
                    object: home.homegate,
                    objectIdField: "serialNo"
                }
            )
        }

        if (superUser && !environment().overtureMode && !environment().elkoProductionMode && home && home.homegate) {
            homegateActions.push(
                {
                    label: "Disable gateway web",
                    actionHandler: this.props.handlers.disableGatewayWebHandler,
                    object: home.homegate,
                    objectIdField: "serialNo"
                },
                {
                    label: "Enable gateway web",
                    actionHandler: this.props.handlers.enableGatewayWebHandler,
                    object: home.homegate,
                    objectIdField: "serialNo"
                }
            )
        }

        let homeFields = [];
        if (environment().appBackendMode) {
            homeFields = [
                {label: "Home name", paths: ["props.appBackend-home-name"]},
                {label: "Installed by user", paths: ["fullName"]},
                {label: "Gateway label ID", paths: ["props.gatewayLabelId"]}
            ]
        }
        else if (environment().overtureMode) {
            homeFields = [
                {label: "Installed by user", paths: ["fullName"]}
            ]
        }
        else if (environment().safe4mode) {
            homeFields = [
                {label: "Name", paths: ["fullName"]},
                {label: "Street address", paths: ["address.street"]},
                {label: "ZIP code", paths: ["address.zipCode"]},
                {label: "City", paths: ["address.city"]},
                {label: "Location (lat long)", paths: ["address.location.latitude", "address.location.longitude"]},
                {label: "Transmission number", paths: ["props.transmissionNumber"]}
            ]
        }

        const homegateFields = []
        if (environment().safe4mode) {
            homegateFields.push({label: "Partner ID", paths: ["homegate.partnerId"]})
        }

        if (environment().appBackendMode) {
            homegateFields.push({label: "Ethernet mac address", paths: ["homegate.serialNo"]})
        }
        else {
            homegateFields.push({label: "Serial number", paths: ["homegate.serialNo"]})
        }
        homegateFields.push({label: "Connection status", paths: ["homegate.connectionStatus"]})
        homegateFields.push({label: "Last heartbeat at", paths: ["homegate.lastActivityAt"]})
        homegateFields.push({label: "Software version", paths: ["homegate.softwareVersion"]})
        homegateFields.push({label: "Coordinator version", paths: ["homegate.zigbeeCoordinatorVersion"]})
        homegateFields.push({label: "Coordinator mac address", paths: ["homegate.zigbeeCoordinatorMacAddress"]})

        if (home && home.homegate && home.homegate.softwareVersion.indexOf("3.") === 0) {
            homegateFields.push({label: "IP address", paths: ["homegate.ethernetIp"]})
        }
        else {
            homegateFields.push(
                {label: "GSM signal quality", paths: ["homegate.gsmCsq"]},
                {label: "WLAN APN", paths: ["homegate.wlanApn"]},
                {label: "WLAN IP", paths: ["homegate.wlanIp"]},
                {label: "Battery voltage", paths: ["homegate.batteryVoltage"]},
                {label: "Battery charge state", paths: ["homegate.batteryChargeState"]}
            )
        }

        return (
        <div className="home-details-wrapper">
            {fetchHomesFailed === true &&
            <Grid><Row><Col><h3>Error: Could not load home. Try <a href="javascript:window.location.reload(true)">refreshing</a> the page.</h3></Col></Row></Grid>
            }
            {homeNotFound === true &&
            <GridHeader title="Home not found!"/>
            }

            {(!homeNotFound || homeNotFound === false) && (!fetchHomesFailed || fetchHomesFailed === false) &&
            <Grid>
                <Row className="first">
                    <Col md={environment().safe4mode ? 4 : 6}>
                        <Panel header={<h3>Home info</h3>}>
                            <KeyValueList
                                isFetching={isFetchingHome}
                                data={home}
                                fields={homeFields}
                            />
                            {(superUser || environment().overtureMode) && home &&
                                <ActionDropdown
                                    home={home}
                                    actions={[
                                        {
                                            label: "Delete home",
                                            actionHandler: this.props.handlers.deleteHomeHandler,
                                            object: home,
                                            objectIdField: "homeId"
                                        }
                                    ]}/>
                            }
                        </Panel>
                    </Col>
                    {environment().safe4mode &&
                    <Col md={4}>
                        <Panel header={<h3>Active profile</h3>}>
                            <KeyValueList
                                isFetching={isFetchingHome}
                                data={home}
                                fields={[
                                    {label: "Mode", paths: ["activeProfile.mode"]},
                                    {label: "Changed by", paths: ["activeProfile.modeChangedBy"]},
                                    {label: "Changed at", paths: ["activeProfile.modeChangedAt"]}
                                ]}
                            />
                        </Panel>
                    </Col>
                    }
                    <Col md={environment().safe4mode ? 4 : 6}>
                        <Panel header={<h3>Gateway</h3>}>
                            {home && home.homegate &&
                                <div>
                                    <KeyValueList
                                        isFetching={isFetchingHome}
                                        data={home}
                                        fields={homegateFields}
                                    />
                                    <ActionDropdown
                                        home={home}
                                        actions={homegateActions}
                                    />
                                </div>
                            }
                            {home && !home.homegate &&
                                <div>No gateway assigned to home yet!</div>
                            }
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Table
                            title="Active alerts"
                            data={alertData}
                            isFetching={isFetchingAlerts || isFetchingHome}
                            columns={defaultAlertColumns}
                            rawDataUrl={rawAlertsUrl}
                            height={alertData ? (alertData.length * 40 + 40) : 200}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Table
                            title="Devices"
                            isFetching={isFetchingHome}
                            columns={defaultDeviceColumns}
                            data={devices}
                            columnMetadata={devicesColumnMetadata}
                            height={devices ? (devices.length * 40 + 40) : 200}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Table
                            title="Users"
                            isFetching={isFetchingHome}
                            columns={defaultUserColumns}
                            data={users}
                            columnMetadata={usersColumnMetadata}
                            height={users ? (users.length * 40 + 40) : 200}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Table
                            title="Events"
                            data={eventData}
                            isFetching={isFetchingEvents || isFetchingHome}
                            columns={defaultEventColumns}
                            rawDataUrl={rawEventsUrl}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Table
                            title="Actions"
                            data={actionData}
                            isFetching={isFetchingActions || isFetchingHome}
                            columns={defaultActionColumns}
                            rawDataUrl={rawActionsUrl}
                        />
                    </Col>
                </Row>
                {environment().safe4mode &&
                    <Row>
                        <Col md={12}>
                            <Table
                                title="Contacts"
                                isFetching={isFetchingHome}
                                columns={defaultContactColumns}
                                data={contacts}
                                columnMetadata={contactsColumnMetadata}
                                height={contacts ? (contacts.length * 40 + 40) : 200}
                            />
                        </Col>
                    </Row>
                }
                {superUser && home && environment().safe4mode &&
                    <Row>
                        <Col md={12}>
                            <SetPinForm
                                data={this.props.data}
                                updatePinHandler={this.props.handlers.updatePinHandler}
                            />
                        </Col>
                    </Row>
                }
            </Grid>
            }
        </div>
        )
    }
}

HomeDetails.propTypes = {
    data: PropTypes.object.isRequired,
    handlers: PropTypes.object.isRequired
}

export default HomeDetails
