import React, { Component, PropTypes } from 'react'
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'
import ActionOption from './ActionOption.jsx'

class ActionDropdown extends Component {
    render() {
      const { home, actions } = this.props
      if (!home) {
          return
      }
      return (
        <ButtonToolbar>
            <DropdownButton bsSize="small" title="Action" id="dropdown-size-small">
              {actions.map(action =>
                  <ActionOption object={action.object} objectIdField={action.objectIdField} actionHandler={action.actionHandler} home={home} label={action.label}/>
              )}
            </DropdownButton>
        </ButtonToolbar>
        )
    }
}

ActionDropdown.propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.array.isRequired,
}

export default ActionDropdown
