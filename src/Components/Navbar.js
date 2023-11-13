import React from 'react'
import {Link} from 'react-router-dom'
import logo from '../Images/logo.png'
import {Icon} from 'react-icons-kit'
import {shoppingCart} from 'react-icons-kit/feather/shoppingCart'
import {auth} from '../Config/Config'
import {useHistory} from 'react-router-dom'


export const Navbar = ({ user, totalProducts }) => {
    const history = useHistory();
  
    const handleLogout = () => {
      auth.signOut().then(() => {
        history.push('/login');
      });
    };
  
    return (
      <div className='navbar'>
        <div className='leftside'>
          
            <Link className='btn btn-warning btn-md' to='Home'>
              HOME
            </Link>
          
        </div>
        <div className='middleside'>
          <h2 style={{ color: 'white', fontWeight: 'bold' }}>Food Blocks</h2>
        </div>
        <div className='rightside'>
          {!user && (
            <>
              <div>
                <Link className='navlink' to='signup'>
                  SIGN UP
                </Link>
              </div>
              <div>
                <Link className='navlink' to='login'>
                  LOGIN
                </Link>
              </div>
            </>
          )}
          {user && (
            <>
              <div>
                <Link className='navlink' to='/'>
                  {user}
                </Link>
              </div>
              <div className='cart-menu-btn'>
                <Link className='navlink' to='cart'>
                  <Icon icon={shoppingCart} size={20} />
                </Link>
                <span className='cart-indicator'>{totalProducts}</span>
              </div>
              <div className='btn btn-warning btn-md' onClick={handleLogout}>
                LOGOUT
              </div>
            </>
          )}
          
        </div>
      </div>
    );
  };