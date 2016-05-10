import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import DataGrid from '../components/data-grid'
import {getSchema, updateColumn} from '../actions'

class TableSchema extends React.Component {
  constructor (props) {
    super(props)
    this.onRowUpdate = this.onRowUpdate.bind(this)
  }

  render () {
    const tableName = this.props.params.name
    const contentsPath = `tables/${tableName}`
    const columns = ['name', 'type', 'maxLength', 'nullable', 'defaultValue']
    console.log(this.props.schema.fields)
    return (
      <div>
        <h1>{tableName}</h1>
        <Link to={contentsPath}>Edit Contents</Link>
        {this.props.schema.fields &&
          <DataGrid
            rows={this.props.schema.fields}
            fields={columns}
            onRowUpdate={this.onRowUpdate}
          />
        }
      </div>
    )
  }

  componentDidMount () {
    const {dispatch, database} = this.props
    const tableName = this.props.params.name
    dispatch(getSchema(database, tableName))
  }

  onRowUpdate (changes) {
    const {dispatch, database} = this.props
    const tableName = this.props.params.name
    const primaryKey = 'name'

    const rowIndex = changes.rowIdx
    const updates = changes.updated
    const field = this.props.schema.fields[rowIndex] || {} // TODO: Won't work if sorting enabled
    const primaryKeyValue = field[primaryKey]

    dispatch(updateColumn(database, tableName, primaryKeyValue, updates, rowIndex))
  }
}

TableSchema.propTypes = {
  params: React.PropTypes.object,
  database: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  schema: React.PropTypes.object
}

const mapStateToProps = (state) => ({
  database: state.database,
  schema: state.schema
})

export default connect(mapStateToProps)(TableSchema)
