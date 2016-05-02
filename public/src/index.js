import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import dbConfig from './config/database'
import Database from './models/database'
import Navbar from './components/navbar'
import ListTables from './routes/list-tables'
import TableContents from './routes/table-contents'
import TableSchema from './routes/table-schema'
import Query from './routes/query'

class App extends React.Component {
  constructor () {
    super()
    this.state = {db: new Database(dbConfig) || function () {}}
  }

  render () {
    return (
      <div>
        <Navbar />
        <div className='content'>
          {this.props.children && React.cloneElement(this.props.children, {db: this.state.db})}
        </div>
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
      <IndexRoute component={ListTables} />
      <Route path='tables/:name' component={TableContents} />
      <Route path='tables/:name/schema' component={TableSchema} />
      <Route path='query' component={Query} />
    </Route>
  </Router>
), document.getElementById('main'))
