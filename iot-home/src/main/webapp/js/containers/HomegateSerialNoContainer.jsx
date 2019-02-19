import React, { Component, PropTypes } from 'react'
import HomeDetails from '../components/HomeDetails.jsx'
import $ from 'jquery'
import getHomeId from '../utils/getHomeId'
import Loader from 'halogen/PulseLoader'
import { Grid, Row, Col } from 'react-bootstrap'

class HomegateSerialNoContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {isFetchingHome: true}
  }

  componentDidMount() {
    this.fetchHome(this.props.params.homegateSerialNo)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.params.homegateSerialNo !== newProps.params.homegateSerialNo) {
      this.fetchHome(newProps.params.homegateSerialNo)
    }
  }

  fetchHome(homegateSerialNo) {
    $.getJSON("/api/homegates/serialNo/" + homegateSerialNo)
        .done(home => this.props.history.replace('/homes/' + getHomeId(home)))
        .fail(((data) => this.setState({homeNotFound: (data.status == 404), fetchHomesFailed: (data.status != 404), isFetchingHome: false, homegateSerialNo: homegateSerialNo})).bind(this))
  }

  render() {
    return (
        <Grid><Row><Col>
          { this.state.isFetchingHome === true &&
            <Loader color="#444f55" size="16px" margin="4px"/>
          }
          { this.state.homeNotFound === true &&
            <h3>No match for "{this.state.homegateSerialNo}" found!</h3>
          }
          { this.state.fetchHomesFailed === true &&
            <h3>Error: Could not load home. Try <a href="javascript:window.location.reload(true)">refreshing</a> the page.</h3>
          }
        </Col></Row></Grid>
    )
  }
}

HomegateSerialNoContainer.propTypes = {
  params: PropTypes.object.isRequired, //path params injected by the react router
  history: PropTypes.object.isRequired //HTML5 history API injected by the react router
}

export default HomegateSerialNoContainer
