import React, { Component, PropTypes } from 'react'
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'
import $ from 'jquery'

class ActionOption extends Component {
    constructor(props) {
        super(props)
        this.handleAction = this.handleAction.bind(this)
    }

    handleAction(objectId) {
        const { home, actionHandler } = this.props
        actionHandler(home, objectId)
        $("#app").click(); //hack for hiding actionmenu
    }

    render() {
        const { object, objectIdField, label } = this.props
        return (
            <MenuItem eventKey={object[objectIdField]} onSelect={this.handleAction}>{label}</MenuItem>
        )
    }
}

ActionOption.propTypes = {
    actionHandler: PropTypes.func.isRequired,
    object: PropTypes.object.isRequired,
    objectIdField: PropTypes.string.isRequired,
    home: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired
}

export default ActionOption
