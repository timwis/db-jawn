import React from 'react'
import Handsontable from 'handsontable'
import {values} from 'lodash'

class DataGrid extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  render () {
    return (
      <div ref='grid' className='data-grid' />
    )
  }

  componentDidMount () {
    const columns = this.props.fields.map((field) => field.name)
    // const rowsCopy = cloneDeep(this.props.rows)
    const opts = {
      data: this.props.rows,
      colHeaders: columns,
      minSpareRows: 1
      // observeChanges: true
    }
    if (this.props.onRowUpdate) opts.beforeChange = this.handleChange
    else opts.readOnly = true
    this.grid = new Handsontable(this.refs.grid, opts)
  }

  handleChange (changes, source) {
    // Only trigger for certain types of changes
    if (!['edit', 'empty', 'autofill', 'paste', 'undo', 'redo'].includes(source)) return

    // Map array of each change to an array of row changes
    const changesByRow = {}
    changes.map((change) => {
      const [rowIndex, property, , newValue] = change
      if (!changesByRow[rowIndex]) changesByRow[rowIndex] = {rowIndex, updates: {}}
      changesByRow[rowIndex].updates[property] = newValue
    })

    // Pass array of row changes to parent component's handler
    this.props.onRowUpdate(values(changesByRow))

    // Override default behavior by not saving changes (parent component will do that)
    return false
  }

  // Listen for props changes and update the grid. This overrides default
  // behavior of Handsontable in order to treat state as immutable
  componentWillReceiveProps () {
    this.grid.render()
  }
}

DataGrid.propTypes = {
  rows: React.PropTypes.array,
  fields: React.PropTypes.array,
  onRowUpdate: React.PropTypes.func
}

export default DataGrid
