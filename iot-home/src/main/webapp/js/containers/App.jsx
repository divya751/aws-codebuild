import React, { Component, PropTypes } from 'react'
import { Grid, Table, Row, Col, PageHeader } from 'react-bootstrap'
import SearchBox from '../components/SearchBox.jsx'
import HomeDetailsContainer from './HomeDetailsContainer.jsx'
import { Router, Route, IndexRoute } from 'react-router'
import $ from 'jquery'
import environment from '../utils/environment'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.openFrontpage = this.openFrontpage.bind(this)
    this.state = {searchBoxData: []}
  }

  componentDidMount() {
    $.getJSON("/api/client-specific/home-web/homes")
        .done((data => this.setState({searchBoxData: (data._embedded ? data._embedded.homes : [])})).bind(this))
    $.getJSON("/api/userInfo")
        .done((data => this.setState({userInfo: data})).bind(this))
  }

  handleSearch(query) {
    if (query.length == 12) {
        this.props.history.push('/homegates/' + query)
    }
    else {
        this.props.history.push('/transmissionNumbers/' + query)
    }
  }

  openFrontpage() {
      this.props.history.push('/')
  }

  renderChildren() {
      return React.Children.map(this.props.children, child => {
          if (child.type === HomeDetailsContainer) {
              return React.cloneElement(child, {
                  userInfo: this.state.userInfo
              })
          } else {
              return child
          }
      });
  }

  render() {
    return (
        <div>
            <Grid>
                <Row>
                    <Col md={7}>
                        <PageHeader className="link-cursor" onClick={this.openFrontpage}>Home admin</PageHeader>
                    </Col>
                    <Col md={5} className="text-right">
                        <div className="logout-container">
                            <form method="post" action="/sso/logout">
                                {this.state.userInfo &&
                                    <span className="sentence">{this.state.userInfo.fullName} ({this.state.userInfo.username})</span>
                                }
                                <a href={"https://login" + environment().hostSuffix + "." + environment().domain + "/auth/realms/" + environment().keycloakRealm + "/account/password?referrer=home-web"}>My account</a>
                                <button type="submit" className="logout">Logout</button>
                            </form>
                        </div>
                        <SearchBox handleSearch={this.handleSearch} searchBoxData={this.state.searchBoxData} />
                    </Col>
                </Row>
            </Grid>
            {this.renderChildren()}
        </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired, //injected react router (current route handler)
  history: PropTypes.object.isRequired //HTML5 history API injected by the react router
}

export default App