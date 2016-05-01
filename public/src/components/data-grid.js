/*eslint no-new:0*/
import React from 'react'
import Handsontable from 'handsontable'

class DataGrid extends React.Component {
  constructor (props) {
    super(props)
    this.afterChange = this.afterChange.bind(this)
  }

  render () {
    return (
      <div ref='grid' className='data-grid' />
    )
  }

  componentDidMount () {
    const columns = this.props.fields.map((field) => field.name)
    const opts = {
      data: this.props.rows,
      colHeaders: columns
    }
    if (this.props.onRowUpdate) opts.afterChange = this.afterChange
    new Handsontable(this.refs.grid, opts)
  }

  afterChange (changes, source) {
    // Only trigger for certain types of changes
    if (!['edit', 'empty', 'autofill', 'paste', 'undo', 'redo'].includes(source)) return

    // Convert changes from array of arrays to array of objects for easier use
    this.props.onRowUpdate(changes.map((change) => {
      let [rowIndex, property, oldValue, newValue] = change
      return {rowIndex, property, oldValue, newValue}
    }))
  }
}

DataGrid.propTypes = {
  rows: React.PropTypes.array,
  fields: React.PropTypes.array,
  onRowUpdate: React.PropTypes.func
}

export default DataGrid
