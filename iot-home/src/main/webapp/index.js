import 'babel-core/polyfill'
import 'bootstrap/dist/css/bootstrap.css'
import './css/style.css'
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, Route, IndexRoute } from 'react-router'
import App from './js/containers/App.jsx'
import FrontpageContainer from './js/containers/FrontpageContainer.jsx'
import HomeDetailsContainer from './js/containers/HomeDetailsContainer.jsx'
import HomegateSerialNoContainer from './js/containers/HomegateSerialNoContainer.jsx'
import TransmissionNumberContainer from './js/containers/TransmissionNumberContainer.jsx'

window.onerror = (message => alert(message + "\n\nSee developer console for details."))

render(
    <Router history={createBrowserHistory()}>
        <Route path="/" component={App}>
            <IndexRoute component={FrontpageContainer}/>
            <Route path="/transmissionNumbers/:transmissionNumber" component={TransmissionNumberContainer}/>
            <Route path="/homegates/:homegateSerialNo" component={HomegateSerialNoContainer}/>
            <Route path="/homes/:homeId" component={HomeDetailsContainer}/>
        </Route>
    </Router>,
    document.getElementById('app')
)
