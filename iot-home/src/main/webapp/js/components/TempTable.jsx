import { Table as BootstrapTable } from 'react-bootstrap'
import React, { Component, PropTypes } from 'react'

class TempTable extends Component {
    render() {
        const { title, headers, rows } = this.props

        return (
            <div>
                <h3>{title}</h3>
                <BootstrapTable striped bordered condensed hover>
                    <thead>
                        <tr>
                            {headers.map(header =>
                                <th>{header}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row =>
                            <tr>
                                {row.map(cell =>
                                    <td className={cell.className}>{cell.value}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </BootstrapTable>
            </div>
        )
    }
}

TempTable.propTypes = {
    title: PropTypes.string.isRequired,
    headers: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired
}

export default TempTable