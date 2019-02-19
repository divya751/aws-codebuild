import { Navbar, Input, Button } from 'react-bootstrap'
import React, { Component, PropTypes } from 'react'
import { Typeahead } from 'react-typeahead'
import environment from '../utils/environment'

class SearchBox extends Component {
    constructor(props) {
        super(props)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleSearchClick = this.handleSearchClick.bind(this)
        this.loadHome = this.loadHome.bind(this)
    }

    componentWillReceiveProps(newProps) {
        this.refs.typeahead.state = {} //clear input
    }

    handleSearchClick() {
        var value = document.getElementById("search-input").value
        this.props.handleSearch(value)
    }

    handleKeyUp(e) {
        if (e.keyCode === 13) {
            this.handleSearchClick()
        }
    }

    loadHome(home) {
        if (home.homegate && home.homegate.serialNo) {
            this.props.handleSearch(home.homegate.serialNo)
        }
        else if (home.props && home.props.transmissionNumber) {
            this.props.handleSearch(home.props.transmissionNumber)
        }
        else {
            alert("Unexpected search value")
        }
    }

    filterOption(input, home) {
        let searchTarget = home.homegate ? (home.homegate.serialNo + ", ") : ""
        searchTarget += home.props && home.props.transmissionNumber ? (home.props.transmissionNumber + ", ") : ""
        searchTarget += home.props && home.props['appBackend-home-name'] ? (home.props['appBackend-home-name'] + ", ") : ""
        searchTarget += home.props && home.props['gatewayLabelId'] ? (home.props['gatewayLabelId'] + ", ") : ""
        searchTarget += home.firstName + " " + home.lastName + ", "
        searchTarget += home.users ? ("users: " + home.users.map(u => u.firstName + " " + u.lastName).join(", ") + ", ") : ""
        searchTarget += home.address ? + (home.address.street + ", " + home.address.zipCode + " " + home.address.city + ", ") : ""
        return searchTarget.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    displayOption(home, index) {
        if (environment().safe4mode) {
            let homegateInfo = home.homegate ? (" (gateway " + home.homegate.serialNo + ")") : ""
            let result = home.props.transmissionNumber + homegateInfo + " - " + home.firstName + " " + home.lastName
            if (home.address) {
                result += ", " + home.address.street + ", " + home.address.zipCode + " " + home.address.city
            }
            return result
        }
        else if (environment().appBackendMode) {
            let result = home.props ? ("\"" + home.props['appBackend-home-name'] + "\" ") : ""
            result += home.homegate ? ("- gateway: " + home.homegate.serialNo + ", ") : ""
            result += home.users ? (" users: " + home.users.map(u => u.firstName + " " + u.lastName).join(", ")) : ""
            return result
        }
        else {
            let homegateInfo = home.homegate ? ("Gateway " + home.homegate.serialNo + ", ") : ""
            let result = homegateInfo + home.firstName + " " + home.lastName
            if (home.address) {
                result += ", " + home.address.street + ", " + home.address.zipCode + " " + home.address.city
            }
            return result
        }
    }

    render() {
        const typeaheadClasses = {
            input: "form-control",
            results: "typeahead-results"
        }

        let options = this.props.searchBoxData
        if (environment().appBackendMode) {
            options = options.filter(h => h.props && h.props['appBackend-home-name'])
        }

        return (
        <Navbar.Form className="no-padding">
            <div className="form-group" ref="inputContainer">
                <Typeahead
                    options={options}
                    maxVisible={10}
                    placeholder={environment().safe4mode ? "TransNr, name, serialNo, ..." : "Name, serialNo, ..."}
                    onKeyUp={this.handleKeyUp}
                    customClasses={typeaheadClasses}
                    inputProps={{id:"search-input"}}
                    ref="typeahead"
                    onOptionSelected={this.loadHome}
                    filterOption={this.filterOption}
                    displayOption={this.displayOption}
                />
            </div>
        </Navbar.Form>
        )
    }
}

SearchBox.propTypes = {
    handleSearch: PropTypes.func.isRequired,
    searchBoxData: PropTypes.array
}

export default SearchBox
