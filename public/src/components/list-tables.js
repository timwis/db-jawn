import React from 'react'
import {Link} from 'react-router'

class ListTables extends React.Component {
  render () {
    const tableItems = this.props.tables.map((table, index) => {
      const path = 'tables/' + table.tablename
      return (
        <Link to={path} key={index} className='list-group-item'>
          {table.tablename}
        </Link>
      )
    })
    return (
      <div>
        <h1>Tables</h1>
        <ul className='list-group'>
          {tableItems}
        </ul>
      </div>
    )
  }
}

ListTables.propTypes = {
  tables: React.PropTypes.array
}

export default ListTables
