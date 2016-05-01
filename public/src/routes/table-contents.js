import React from 'react'
import ReactDataGrid from 'react-data-grid'

class TableContents extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rows: [],
      rowCount: 0,
      fields: [],
      primaryKey: null
    }
    this.getRowAtIndex = this.getRowAtIndex.bind(this)
    this.onRowUpdate = this.onRowUpdate.bind(this)
  }

  render () {
    return (
      <div>
        <h1>{this.props.params.name}</h1>
        {this.state.rows.length > 0 &&
          <ReactDataGrid
            rowGetter={this.getRowAtIndex}
            columns={this.getColumns()}
            rowsCount={this.state.rowCount}
            minHeight={500}
            enableCellSelect
            onRowUpdated={this.onRowUpdate}
          />
        }
      </div>
    )
  }

  componentDidMount () {
    const tableName = this.props.params.name
    this.props.db.getRows(tableName).then((response) => {
      this.setState({
        rows: response.rows,
        rowCount: response.rowCount,
        fields: response.fields
      })
    })
    this.props.db.describe(tableName).then((response) => this.setState({primaryKey: response.primaryKey}))
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

    // Update database
    const tableName = this.props.params.name
    const conditions = {[this.state.primaryKey]: rows[event.rowIdx][this.state.primaryKey]}
    this.props.db.knex(tableName).where(conditions).update(event.updated).then((response) => console.log('updated', response))
  }
}

TableContents.propTypes = {
  params: React.PropTypes.object,
  db: React.PropTypes.object
}

export default TableContents
