import React from 'react'
import ReactDataGrid from 'react-data-grid'

import QueryInput from '../components/query-input'

class Query extends React.Component {
  constructor () {
    super()
    this.state = {
      rows: [],
      rowCount: 0,
      fields: []
    }
    this.executeQuery = this.executeQuery.bind(this)
    this.getRowAtIndex = this.getRowAtIndex.bind(this)
    this.onRowUpdate = this.onRowUpdate.bind(this)
  }

  render () {
    return (
      <div>
        <QueryInput onQuery={this.executeQuery} />
        {this.state.rows.length > 0 &&
          <ReactDataGrid
            rowGetter={this.getRowAtIndex}
            columns={this.getColumns()}
            rowsCount={this.state.rowCount}
            minHeight={500}
          />
        }
      </div>
    )
  }

  executeQuery (query) {
    this.props.db.query(query).then((response) => {
      console.log(response)
      this.setState({
        rows: response.rows,
        rowCount: response.rowCount,
        fields: response.fields
      })
    })
  }

  getColumns () {
    return this.state.fields.map((field) => ({
      key: field.name,
      name: field.name,
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

Query.propTypes = {
  db: React.PropTypes.object
}

export default Query
