import { Table as BootstrapTable } from 'react-bootstrap'
import React, { Component, PropTypes } from 'react'
import Loader from 'halogen/PulseLoader'
import objectPath from 'object-path'
import Griddle from 'griddle-react'

class Table extends Component {
    render() {
        const { title, columns, isFetching, data, rawDataUrl, columnMetadata, height } = this.props
        const resultsPerPage = 6

        if (data) {
            //invoke toString() on all values
            for (const obj of data) {
                for (const field of Object.keys(obj)){
                    obj[field] = obj[field] != null ? obj[field].toString() : ""
                }
            }
        }

        return (
            <div>
                <h3>{title}</h3>
                {isFetching === true &&
                    <Loader color="#444f55" size="16px" margin="4px"/>
                }

                {isFetching === false &&
                    <Griddle
                        results={data}
                        columns={columns}
                        showSettings={true}
                        showFilter={true}
                        resultsPerPage={resultsPerPage}
                        enableInfiniteScroll={data && (data.length > resultsPerPage)}
                        showPager={false}
                        bodyHeight={height || 200}
                        useFixedHeader={true}
                        columnMetadata={columnMetadata}
                    />
                }

                {rawDataUrl && rawDataUrl.length > 0 &&
                    <div className="raw-data-link">
                        <a href={rawDataUrl} target="_blank">Raw data</a>
                    </div>
                }
            </div>
        )
    }
}

Table.propTypes = {
    title: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    data: PropTypes.array,
    columns: PropTypes.array.isRequired,
    rawDataUrl: PropTypes.string,
    columnMetadata: PropTypes.array,
    height: PropTypes.number
}

export default Table