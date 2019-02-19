import React, { Component, PropTypes } from 'react'
import Frontpage from '../components/Frontpage.jsx'
import $ from 'jquery'
import bigInt from 'big-integer'
import environment from '../utils/environment'

class FrontpageContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {isFetchingHomes: true}
    }

    homeComparator(a, b) {
        const idA = bigInt(a.homeId, 16);
        const idB = bigInt(b.homeId, 16);
        return -idA.compare(idB);
    }

    componentDidMount() {
        $.getJSON("/api/client-specific/home-web/homes")
            .done((data => {
                let homes = data._embedded ? data._embedded.homes : [];
                if (environment().appBackendMode) {
                    homes = homes.filter(h => h.props && h.props['appBackend-home-name'])
                }
                homes.sort(this.homeComparator)
                this.setState({homes: homes, isFetchingHomes: false})
            }).bind(this))
            .fail((() => this.setState({fetchHomesFailed: true, isFetchingHomes: false})).bind(this))
    }

    render() {
        return (
            <Frontpage data={this.state}/>
        )
  }
}

FrontpageContainer.propTypes = {
    params: PropTypes.object.isRequired //path params injected by the react router
}

export default FrontpageContainer
