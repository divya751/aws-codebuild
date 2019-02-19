import React, { Component, PropTypes } from 'react'
import HomeDetails from '../components/HomeDetails.jsx'
import $ from 'jquery'
import getHomeId from '../utils/getHomeId'
import Loader from 'halogen/PulseLoader'
import { Grid, Row, Col } from 'react-bootstrap'

class TransmissionNumberContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {isFetchingHome: true}
    }

    componentDidMount() {
        this.fetchHome(this.props.params.transmissionNumber)
    }

    componentWillReceiveProps(newProps) {
        if (this.props.params.transmissionNumber !== newProps.params.transmissionNumber) {
            this.fetchHome(newProps.params.transmissionNumber)
        }
    }

    fetchHome(transmissionNumber) {
        $.getJSON("/api/homes/props/transmissionNumber/" + transmissionNumber)
            .done(home => this.props.history.replace('/homes/' + getHomeId(home)))
            .fail(((data) => this.setState({homeNotFound: (data.status == 404), fetchHomesFailed: (data.status != 404), isFetchingHome: false, transmissionNumber: transmissionNumber})).bind(this))
    }

    render() {
        return (
            <Grid><Row><Col>
                { this.state.isFetchingHome === true &&
                <Loader color="#444f55" size="16px" margin="4px"/>
                }
                { this.state.homeNotFound === true &&
                <h3>No match for "{this.state.transmissionNumber}" found!</h3>
                }
                { this.state.fetchHomesFailed === true &&
                <h3>Error: Could not load home. Try <a href="javascript:window.location.reload(true)">refreshing</a> the page.</h3>
                }
            </Col></Row></Grid>
        )
    }
}

TransmissionNumberContainer.propTypes = {
    params: PropTypes.object.isRequired, //path params injected by the react router
    history: PropTypes.object.isRequired //HTML5 history API injected by the react router
}

export default TransmissionNumberContainer
