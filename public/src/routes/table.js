import React from 'react'

class Table extends React.Component {
  constructor (props) {
    super(props)
    this.state = {fields: {}}
  }

  render () {
    const rows = []
    for (let fieldName in this.state.fields) {
      const field = this.state.fields[fieldName]
      rows.push(
        <tr key={fieldName}>
          <td><input type='text' className='form-control' defaultValue={fieldName} /></td>
          <td><input type='text' className='form-control' defaultValue={field.type} /></td>
        </tr>
      )
    }
    return (
      <div>
        <h1>{this.props.params.name}</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }

  componentDidMount () {
    this.props.db.describe(this.props.params.name).then((response) => {
      console.log(response)
      this.setState({fields: response})
    })
  }
}

Table.propTypes = {
  params: React.PropTypes.object,
  db: React.PropTypes.object
}

export default Table
