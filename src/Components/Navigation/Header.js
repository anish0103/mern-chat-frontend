import {React, useContext} from 'react'

import './Header.css';
import { AuthContext } from '../Context/AuthContext';
import { NavLink } from 'react-router-dom';

function Header() {

    const Auth = useContext(AuthContext);
    let buttontext;
    if(Auth.isLoggedIn) {
        buttontext = "Logout"
    } else {
        buttontext = "SignIn"
    }

    const LoginHandler = () => {
        if(Auth.isLoggedIn) {
            Auth.logout()
        } 
    }

    return (
        <div className='header-maincontainer'>
            <div className='header-projectname'>
                <h2>Chat Application</h2>
            </div>
            <div className='header-button'>
                {!Auth.isLoggedIn && <NavLink to="/Auth">{buttontext}</NavLink>}
                {!Auth.isLoggedIn && <NavLink to="/">Home</NavLink>}
                {Auth.isLoggedIn && <NavLink to="/" onClick={LoginHandler}>{buttontext}</NavLink>}
            </div>
        </div>
    )
}

export default Header;
