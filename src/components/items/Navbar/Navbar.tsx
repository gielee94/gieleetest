import React from 'react';
import { SigninButton } from './SignIn';
import { SignOutButton } from './SignOut';
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal, useAccount }from '@azure/msal-react'




import './Navbar.css';
const Navbar: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  
  return (

    <nav className="navbar">
      <div className="navbar-left">

        <h1><a className ='NavA' href='https://labs.azure.com'>Azure Lab Service</a></h1>
      </div>
      <div className="navbar-right">
        {isAuthenticated ? <div><span className='accountname'>{account?.name}</span> <SignOutButton /> </div> :  <SigninButton />}
      </div>
    </nav>
  );
};

export default Navbar;