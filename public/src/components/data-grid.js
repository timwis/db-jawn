import React from 'react'
import ReactDataGrid from 'react-data-grid'

class DataGrid extends React.Component {
  constructor (props) {
    super(props)
    this.rowByIndex = this.rowByIndex.bind(this)
  }

  render () {
    const colHeaders = this.props.fields.map((field) => field.name || field)
    const columns = colHeaders.map((header) => ({key: header, name: header, editable: true}))
    const rowCount = this.props.rows.length
    return (
      <div>
        <button onClick={this.props.onAddRow} className='btn btn-default'>Add Row</button>
        <ReactDataGrid
          columns={columns}
          rowGetter={this.rowByIndex}
          rowsCount={rowCount}
          enableCellSelect
          onRowUpdated={this.props.onRowUpdate}
          minHeight={500}
        />
      </div>
    )
  }

  rowByIndex (index) {
    return this.props.rows[index]
  }
}

DataGrid.propTypes = {
  rows: React.PropTypes.array,
  fields: React.PropTypes.array,
  onRowUpdate: React.PropTypes.func,
  onAddRow: React.PropTypes.func
}

export default DataGrid
