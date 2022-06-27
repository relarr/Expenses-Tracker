import { Fragment, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../shared/context/auth-context';
import SideDrawer from './SideDrawer';
import Backdrop from './Backdrop';
import './Navigation.css';

const Navigation = () => {
  const auth = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Fragment>
      {drawerOpen && <Backdrop onClick={() => setDrawerOpen(false)} />}
      <SideDrawer show={drawerOpen} onClick={() => setDrawerOpen(false)}>
        <div className='navigation-drawer'>
          {auth.isLoggedIn && (
            <NavLink to='/authenticate' onClick={auth.logout}>
              LOG OUT
            </NavLink>
          )}
        </div>
      </SideDrawer>
      <div className='navigation'>
        {auth.isLoggedIn && (
          <div className='navigation-burger'>
            <button onClick={() => setDrawerOpen(true)}>
              <span />
              <span />
              <span />
            </button>
          </div>
        )}
        <div className='navigation-title'>
          <h2>EXPENSES TRACKER</h2>
        </div>
        <div className='navigation-right'>
          {auth.isLoggedIn && (
            <NavLink to='/authenticate' onClick={auth.logout}>
              LOG OUT
            </NavLink>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Navigation;
