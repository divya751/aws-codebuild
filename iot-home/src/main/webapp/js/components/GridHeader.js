import { Grid, Row, Col } from 'react-bootstrap'
import React, { Component, PropTypes } from 'react'

class GridHeader extends Component {
    render() {
        return (
        <Grid><Row><Col><h3>{this.props.title}</h3></Col></Row></Grid>
        )
    }
}

GridHeader.propTypes = {
    title: PropTypes.string.isRequired
}

export default GridHeader