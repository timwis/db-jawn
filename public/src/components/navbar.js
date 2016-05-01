import React from 'react'
import {Link} from 'react-router'

class Navbar extends React.Component {
  render () {
    return (
      <nav className='navbar navbar-light bg-faded'>
        <Link to='/' className='navbar-brand'>DataFace</Link>
        <ul className='nav navbar-nav'>
          <li className='nav-item'>
            <Link to='/' className='nav-link' activeClassName='active' onlyActiveOnIndex>Tables</Link>
          </li>
          <li className='nav-item'>
            <Link to='query' className='nav-link' activeClassName='active'>Query</Link>
          </li>
        </ul>
      </nav>
    )
  }
}

export default Navbar
