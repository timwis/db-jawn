import React from 'react'
import {Link} from 'react-router'

import DataGrid from '../components/data-grid'

class TableContents extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rows: [],
      fields: [],
      primaryKey: null
    }
    this.onRowUpdate = this.onRowUpdate.bind(this)
  }

  render () {
    const tableName = this.props.params.name
    const schemaPath = `tables/${tableName}/schema`
    return (
      <div>
        <h1>{tableName}</h1>
        <Link to={schemaPath}>Edit Schema</Link>
        {this.state.rows.length > 0 &&
          <DataGrid {...this.state} onRowUpdate={this.onRowUpdate} />
        }
      </div>
    )
  }

  componentDidMount () {
    const tableName = this.props.params.name
    this.props.db.getRows(tableName).then((response) => {
      this.setState({
        rows: response.rows,
        fields: response.fields
      })
    })
    this.props.db.describe(tableName).then((response) => this.setState({primaryKey: response.primaryKey}))
  }

  onRowUpdate (changes) {
    const tableName = this.props.params.name
    const primaryKey = this.state.primaryKey
    const rows = this.state.rows.slice()
    changes.map((rowChanges) => {
      const {rowIndex, updates} = rowChanges
      const row = rows[rowIndex] || {} // TODO: Won't work if sorting enabled
      const identifier = row[primaryKey]

      // If updating existing row
      if (identifier) {
        Object.assign(row, updates)

        const conditions = {[primaryKey]: identifier}
        this.props.db.update(tableName, updates, conditions).then((response) => console.log('updated', response))
      // Otherwise, inserting new row
      } else {
        console.log('new row')
        Object.assign(row, updates)
        this.props.db.insert(tableName, updates).then((response) => {
          Object.assign(row, response[0])
          this.setState({rows})
        })
      }
    })
    this.setState({rows})
  }
}

TableContents.propTypes = {
  params: React.PropTypes.object,
  db: React.PropTypes.object
}

export default TableContents
