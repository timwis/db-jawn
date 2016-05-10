import React from 'react'

import DevTools from './dev-tools'
import Navbar from '../components/navbar'

class App extends React.Component {
  render () {
    return (
      <div>
        <Navbar />
        <div className='content'>
          {this.props.children}
          {process.env.NODE_ENV !== 'production' && <DevTools />}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.object
}

export default App
