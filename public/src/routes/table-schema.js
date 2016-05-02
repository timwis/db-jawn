import React from 'react'
import {Link} from 'react-router'

import DataGrid from '../components/data-grid'

class TableSchema extends React.Component {
  constructor (props) {
    super(props)
    this.state = {fields: [], primaryKey: null}
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
}

TableSchema.propTypes = {
  params: React.PropTypes.object,
  db: React.PropTypes.object
}

export default TableSchema
