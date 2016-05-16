import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import dbConfig from './config/database'
import configureStore from './store'
import App from './containers/app'
import ListTables from './containers/list-tables'
import TableContents from './containers/table-contents'
import TableSchema from './containers/table-schema'
import Query from './containers/query'
import Database from './containers/database'

// Setup store
const initialState = {
  database: dbConfig,
  tables: []
}
const store = configureStore(initialState)

// Render app
ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Database} />
        <Route path='tables' component={ListTables} />
        <Route path='tables/:name' component={TableContents} />
        <Route path='tables/:name/schema' component={TableSchema} />
        <Route path='query' component={Query} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('main'))
