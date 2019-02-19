import React, { Component, PropTypes } from 'react'
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import objectPath from 'object-path'

class SetPinForm extends Component {
    constructor(props) {
        super(props)
        this.handleSetNewPin = this.handleSetNewPin.bind(this)
    }

    handleSetNewPin() {
        const { home } = this.props.data
        var userIndex = document.getElementById("user-index").value
        var pin = document.getElementById("new-pin-input").value
        this.props.updatePinHandler(home.homeId, userIndex, pin)
    }

    render() {
        const { home } = this.props.data

        return (
            <div>
                <h4>Set new PIN for user</h4>
                <FormGroup>
                    <ControlLabel>Select user</ControlLabel>
                    <FormControl componentClass="select" id="user-index">
                        <option value="">Select</option>
                        {home.users.map(user =>
                            <option value={user.index}>{user.firstName} {user.lastName} - {user.email} ({user.role} user)</option>
                        )}
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>New PIN</ControlLabel>
                    <FormControl type="text" placeholder="PIN" id="new-pin-input" />
                </FormGroup>
                <Button type="button" className="set-pin-button" onClick={this.handleSetNewPin}>
                    Set PIN
                </Button>
            </div>
        )
    }
}

SetPinForm.propTypes = {
    data: PropTypes.object.isRequired,
    updatePinHandler: PropTypes.func.isRequired
}

export default SetPinForm