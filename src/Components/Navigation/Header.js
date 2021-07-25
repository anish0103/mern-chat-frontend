import React from 'react'

import './Header.css';

function Header() {
    return (
        <div className='header-maincontainer'>
            <div className='header-projectname'>
                <h2>Project Name</h2>
            </div>
            <div className='header-button'>
                <button>LogIn/signUp</button>
            </div>
        </div>
    )
}

export default Header;
