import React from 'react'
import knex from 'knex'
import ReactDataGrid from 'react-data-grid'

import dbConfig from '../config/database'
import QueryInput from '../components/query-input'

class Query extends React.Component {
  constructor () {
    super()
    this.state = {
      rows: [],
      rowCount: 0,
      fields: []
    }
    this.db = knex(dbConfig)
    this.executeQuery = this.executeQuery.bind(this)
    this.getRowAtIndex = this.getRowAtIndex.bind(this)
    this.onRowUpdate = this.onRowUpdate.bind(this)
  }

  render () {
    const columns = this.getColumns(this.state.rows[0] || [])
    return (
      <div>
        <QueryInput onQuery={this.executeQuery} />
        {this.state.rows.length > 0 &&
          <ReactDataGrid
            rowGetter={this.getRowAtIndex}
            columns={columns}
            rowsCount={this.state.rowCount}
            minHeight={500}
          />
        }
      </div>
    )
  }

  executeQuery (query) {
    this.db.raw(query).then((response) => {
      this.setState({
        rows: response.rows,
        rowCount: response.rowCount,
        fields: response.fields
      })
    })
  }

  getColumns (row) {
    return Object.keys(row).map((key) => ({
      key,
      name: key,
      editable: true
    }))
  }

  getRowAtIndex (index) {
    return this.state.rows[index]
  }

  onRowUpdate (event) {
    const rows = this.state.rows.slice()
    Object.assign(rows[event.rowIdx] || {}, event.updated)
    this.setState({rows})
  }
}

export default Query
