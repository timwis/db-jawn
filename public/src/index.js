import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import DevTools from './containers/dev-tools'
import rootReducer from './reducers'
import dbConfig from './config/database'
import Navbar from './components/navbar'
import ListTables from './containers/list-tables'
import TableContents from './containers/table-contents'
import TableSchema from './containers/table-schema'
import Query from './containers/query'

// App container component
class App extends React.Component {
  render () {
    return (
      <div>
        <Navbar />
        <div className='content'>
          {this.props.children}
          {process.env.NODE_ENV !== 'production' && <DevTools />}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.object
}

// Setup store
const initialState = {
  database: dbConfig,
  tables: []
}
let enhancer = applyMiddleware(thunk)
if (process.env.NODE_ENV !== 'production') {
  enhancer = compose(enhancer, DevTools.instrument())
}
const store = createStore(rootReducer, initialState, enhancer)

// Render app
ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={ListTables} />
        <Route path='tables/:name' component={TableContents} />
        <Route path='tables/:name/schema' component={TableSchema} />
        <Route path='query' component={Query} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('main'))
