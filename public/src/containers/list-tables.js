import React from 'react'
import {connect} from 'react-redux'

import { getTables } from '../actions'
import ListTables from '../components/list-tables'

class ListTablesContainer extends React.Component {
  render () {
    return (
      <ListTables tables={this.props.tables} />
    )
  }

  componentDidMount () {
    this.props.dispatch(getTables(this.props.database))
  }
}

ListTablesContainer.propTypes = {
  database: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  tables: React.PropTypes.array
}

const mapStateToProps = (state) => ({
  database: state.database,
  tables: state.tables
})

export default connect(mapStateToProps)(ListTablesContainer)
