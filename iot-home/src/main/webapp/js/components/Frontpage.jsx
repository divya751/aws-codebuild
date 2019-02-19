import React, { Component, PropTypes } from 'react'
import { Grid, Table, Row, Col, PageHeader } from 'react-bootstrap'
import { Link } from 'react-router'
import getHomeId from '../utils/getHomeId'
import Loader from 'halogen/PulseLoader'
import environment from '../utils/environment'

class Frontpage extends Component {
    render() {
        const { isFetchingHomes, homes, fetchHomesFailed } = this.props.data
        return (
          <Grid>
            <Row className="frontpage-grid-row">
                <Col>
                    {fetchHomesFailed === true &&
                    <div>
                        <h3>Error: Could not load homes. Try <a href="javascript:window.location.reload(true)">refreshing</a> the page.</h3>
                    </div>
                    }

                    {isFetchingHomes === true &&
                    <div>
                        <Loader color="#444f55" size="16px" margin="4px"/>
                    </div>
                    }

                    {isFetchingHomes === false && homes &&
                    <div>
                        {environment().safe4mode &&
                        <div className="reports">
                            <a href="/reports/billing">Billing report</a>
                            &nbsp;|&nbsp;
                            <a href="/reports/users">User report</a>
                        </div>
                        }
                        <div>
                            <h3>{homes.length} homes</h3>
                            {environment().safe4mode &&
                                <Table striped bordered condensed hover>
                                    <thead>
                                    <tr>
                                        {environment().safe4mode &&
                                        <th>Transmission number</th>
                                        }
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>City</th>
                                        <th>Country</th>
                                        <th>Connection status</th>
                                        <th>Software version</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {homes.map(home =>
                                        <tr key={home.props.transmissionNumber} className="frontpage-row">
                                            {environment().safe4mode &&
                                            <td><Link to={'/homes/' + home.homeId}>{home.props.transmissionNumber}</Link></td>
                                            }
                                            {environment().safe4mode &&
                                            <td>{home.firstName} {home.lastName}</td>
                                            }
                                            {!environment().safe4mode &&
                                            <td><Link to={'/homes/' + home.homeId}>{home.firstName} {home.lastName}</Link></td>
                                            }
                                            <td>{home.address ? home.address.street : ""}</td>
                                            <td>{home.address ? home.address.city : ""}</td>
                                            <td>{home.address ? home.address.country : ""}</td>
                                            <td className={'connection-status-' + (home.homegate && home.homegate.connectionStatus)}>{home.homegate && home.homegate.connectionStatus}</td>
                                            <td>{home.homegate && home.homegate.softwareVersion}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            }
                            {environment().appBackendMode &&
                                <Table striped bordered condensed hover>
                                    <thead>
                                    <tr>
                                        <th>Home name</th>
                                        <th>Installed by user</th>
                                        <th>Gateway connection status</th>
                                        <th>Software version</th>
                                        <th>Serial number</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {homes.map(home =>
                                        <tr key={home.props ? home.props.homegateSerialNo : ""} className="frontpage-row">
                                            <td>
                                                <Link to={'/homes/' + home.homeId}>{home.props["appBackend-home-name"] != null ? home.props["appBackend-home-name"] : (home.firstName + " " + home.lastName)}</Link>
                                            </td>
                                            <td>{home.firstName} {home.lastName}</td>
                                            <td className={'connection-status-' + (home.homegate && home.homegate.connectionStatus)}>{home.homegate && home.homegate.connectionStatus}</td>
                                            <td>{home.homegate && home.homegate.softwareVersion}</td>
                                            <td>{home.homegate && home.homegate.serialNo}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            }
                            {!environment().safe4mode && !environment().appBackendMode &&
                                <Table striped bordered condensed hover>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Gateway connection status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {homes.map(home =>
                                        <tr key={home.props ? home.props.homegateSerialNo : ""} className="frontpage-row">
                                            <td>
                                                <Link to={'/homes/' + home.homeId}>{home.firstName} {home.lastName}</Link>
                                            </td>
                                            <td className={'connection-status-' + (home.homegate && home.homegate.connectionStatus)}>{home.homegate && home.homegate.connectionStatus}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            }
                        </div>
                    </div>
                    }
                </Col>
            </Row>
          </Grid>
      )
  }
}

Frontpage.propTypes = {
    data: PropTypes.object.isRequired

}

export default Frontpage
