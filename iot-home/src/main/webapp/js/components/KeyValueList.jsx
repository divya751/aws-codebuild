import React, { Component, PropTypes } from 'react'
import Loader from 'halogen/PulseLoader'
import objectPath from 'object-path'

class KeyValueList extends Component {
    render() {
        const { fields, data, isFetching } = this.props

        return (
            <div>
                {isFetching === true &&
                    <Loader color="#444f55" size="16px" margin="4px"/>
                }

                {isFetching === false &&
                    <ol className="name-value">
                        {fields.map(field =>
                            <li>
                                <label>{field.label}</label>
                                <span>
                                    {field.paths.map(path =>
                                        objectPath.get(data, path)
                                    )}
                                </span>
                            </li>
                        )}
                    </ol>
                }
            </div>
        )
    }
}

KeyValueList.propTypes = {
    fields: PropTypes.array.isRequired,
    data: PropTypes.object,
    isFetching: PropTypes.bool.isRequired
}

export default KeyValueList