import React from 'react'
import {Link} from 'react-router'

import DataGrid from '../components/data-grid'

class TableSchema extends React.Component {
  constructor (props) {
    super(props)
    this.state = {fields: [], primaryKey: null}
    this.onRowUpdate = this.onRowUpdate.bind(this)
  }

  render () {
    const tableName = this.props.params.name
    const contentsPath = `tables/${tableName}`
    const columns = ['name', 'type', 'maxLength', 'nullable', 'defaultValue']
    return (
      <div>
        <h1>{tableName}</h1>
        <Link to={contentsPath}>Edit Contents</Link>
        {this.state.fields.length &&
          <DataGrid
            rows={this.state.fields}
            fields={columns}
            onRowUpdate={this.onRowUpdate}
          />
        }
      </div>
    )
  }

  componentDidMount () {
    this.props.db.describe(this.props.params.name).then((response) => {
      console.log(response)
      this.setState(response)
    })
  }

  onRowUpdate (changes) {
    const tableName = this.props.params.name
    const primaryKey = 'name'
    const fields = this.state.fields.slice()
    changes.map((rowChanges) => {
      const {rowIndex, updates} = rowChanges
      const field = fields[rowIndex] || {} // TODO: Won't work if sorting enabled
      const identifier = field[primaryKey]

      // If updating existing row
      if (identifier && (!updates.maxLength || field.type)) { // HACK: Type must be set before maxLength
        Object.assign(field, updates)
        if (updates.maxLength && !updates.type) updates.type = field.type // HACK: Include type in maxLength change

        this.props.db.updateColumn(tableName, identifier, updates).then((response) => console.log('updated', response))
      // Otherwise, inserting new row
      } else if (updates.name) {
        console.log('new row')
        Object.assign(field, updates)
        this.props.db.insertColumn(tableName, updates.name).then((response) => {
          console.log(response)
          Object.assign(field, response[0])
          this.setState({fields})
        })
      }
    })
    this.setState({fields})
  }
}

TableSchema.propTypes = {
  params: React.PropTypes.object,
  db: React.PropTypes.object
}

export default TableSchema
