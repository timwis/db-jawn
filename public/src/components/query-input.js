import React from 'react'

class QueryInput extends React.Component {
  render () {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <fieldset className='form-group'>
          <label htmlFor='query-input'>Query</label>
          <textarea id='query-input' ref='queryInput' className='form-control' defaultValue='select * from building_codes'></textarea>
        </fieldset>
        <button type='submit' className='btn btn-primary'>Query</button>
      </form>
    )
  }

  onSubmit (event) {
    event.preventDefault()
    this.props.onQuery(this.refs.queryInput.value)
  }
}

QueryInput.propTypes = {
  onQuery: React.PropTypes.func
}

export default QueryInput
