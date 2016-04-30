import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import Navbar from './components/navbar'
import Query from './routes/query'

class App extends React.Component {
  render () {
    return (
      <div>
        <Navbar />
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.object
}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Query} />
    </Route>
  </Router>
), document.getElementById('main'))
