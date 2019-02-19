import React, { Component, PropTypes } from 'react'
import ActionDropdown from './ActionDropdown.jsx'

class ActionDropdownGriddle extends Component {
    render() {
        const { home, actions } = this.props.metadata
        for (const action of actions ) {
            action.object = this.props.rowData
        }
        return (
          <ActionDropdown
              home={home}
              actions={actions}
          />
        )
    }
}

ActionDropdownGriddle.propTypes = {
    rowData: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired
}

export default ActionDropdownGriddle
