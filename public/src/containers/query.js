import React from 'react'

import QueryInput from '../components/query-input'
import DataGrid from '../components/data-grid'

class Query extends React.Component {
  constructor () {
    super()
    this.state = {
      rows: [],
      fields: []
    }
    this.executeQuery = this.executeQuery.bind(this)
  }

  render () {
    return (
      <div>
        <QueryInput onQuery={this.executeQuery} />
        {this.state.rows.length > 0 &&
          <DataGrid {...this.state} />
        }
      </div>
    )
  }

  executeQuery (query) {
    this.props.db.query(query).then((response) => {
      this.setState({
        rows: response.rows,
        fields: response.fields
      })
    })
  }
}

Query.propTypes = {
  db: React.PropTypes.object
}

export default Query
