import React from 'react'
import {connect} from 'react-redux'

import {saveDbConfig} from '../actions'

class Database extends React.Component {
  constructor (props) {
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  render () {
    const db = this.props.database
    return (
      <div>
        <h1>Database Connection</h1>
        <form onSubmit={this.onSave}>
          <fieldset className='form-group'>
            <label htmlFor='host'>Host</label>
            <input
              id='host'
              className='form-control'
              defaultValue={db.host}
              ref='host'
            />
          </fieldset>
          <fieldset className='form-group'>
            <label htmlFor='user'>User</label>
            <input
              id='user'
              className='form-control'
              defaultValue={db.user}
              ref='user'
            />
          </fieldset>
          <fieldset className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              className='form-control'
              defaultValue={db.password}
              ref='password'
            />
          </fieldset>
          <fieldset className='form-group'>
            <label htmlFor='database'>Database</label>
            <input
              id='database'
              className='form-control'
              defaultValue={db.database}
              ref='database'
            />
          </fieldset>
          <button type='submit' className='btn btn-primary'>Save</button>
        </form>
      </div>
    )
  }

  onSave (e) {
    const formData = {
      host: this.refs.host.value,
      user: this.refs.user.value,
      password: this.refs.password.value,
      database: this.refs.database.value
    }
    const dispatch = this.props.dispatch
    dispatch(saveDbConfig(formData))
    this.context.router.push('tables')
    e.preventDefault()
  }
}

Database.propTypes = {
  database: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func
}

Database.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  database: state.database
})

export default connect(mapStateToProps)(Database)
