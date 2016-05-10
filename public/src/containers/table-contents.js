import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import DataGrid from '../components/data-grid'
import {
  getRows,
  getSchema,
  updateRow,
  insertRow
} from '../actions'

class TableContents extends React.Component {
  constructor (props) {
    super(props)
    this.onRowUpdate = this.onRowUpdate.bind(this)
    this.onAddRow = this.onAddRow.bind(this)
  }

  render () {
    const tableName = this.props.params.name
    const schemaPath = `tables/${tableName}/schema`
    return (
      <div>
        <h1>{tableName}</h1>
        <Link to={schemaPath}>Edit Schema</Link>
        {this.props.rows.length > 0 && this.props.schema.fields &&
          <DataGrid
            rows={this.props.rows}
            fields={this.props.schema.fields}
            onRowUpdate={this.onRowUpdate}
            onAddRow={this.onAddRow}
          />
        }
      </div>
    )
  }

  componentDidMount () {
    const {dispatch, database} = this.props
    const tableName = this.props.params.name
    dispatch(getRows(database, tableName))
    dispatch(getSchema(database, tableName))
  }

  onRowUpdate (changes) {
    const {dispatch, database} = this.props
    const tableName = this.props.params.name
    const primaryKey = this.props.schema.primaryKey

    const rowIndex = changes.rowIdx
    const updates = changes.updated
    const row = this.props.rows[rowIndex] || {} // TODO: Won't work if sorting enabled
    const primaryKeyValue = row[primaryKey]

    const conditions = {[primaryKey]: primaryKeyValue}
    dispatch(updateRow(database, tableName, updates, conditions, rowIndex))
  }

  onAddRow () {
    const {dispatch, database} = this.props
    const tableName = this.props.params.name
    dispatch(insertRow(database, tableName, {}))
  }
}

TableContents.propTypes = {
  params: React.PropTypes.object,
  database: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  schema: React.PropTypes.object,
  rows: React.PropTypes.array
}

const mapStateToProps = (state) => ({
  database: state.database,
  rows: state.rows,
  schema: state.schema
})

export default connect(mapStateToProps)(TableContents)
