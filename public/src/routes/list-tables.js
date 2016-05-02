import React from 'react'
import {Link} from 'react-router'

class ListTables extends React.Component {
  constructor (props) {
    super(props)
    this.state = {tables: []}
  }

  render () {
    return (
      <div>
        <h1>Tables</h1>
        <ul className='list-group'>
        {this.state.tables.map((table, index) => {
          const path = 'tables/' + table.tablename
          return <Link to={path} key={index} className='list-group-item'>{table.tablename}</Link>
        })}
        </ul>
      </div>
    )
  }

  componentDidMount () {
    this.props.db.listTables().then((response) => {
      this.setState({tables: response.rows})
    })
  }
}

ListTables.propTypes = {
  db: React.PropTypes.object
}

export default ListTables
