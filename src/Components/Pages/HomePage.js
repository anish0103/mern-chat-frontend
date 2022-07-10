import React from 'react'

import './HomePage.css'
import Picture from './picture.jpg'

const HomePage = () => {
    return (
        <div className='homepage-maincontainer'>
            <div className='homepage-textcontainer'>
                <div className='homepage-welcometext'>
                    <h1>Welcome</h1>
                </div>
                <div className='homepage-besttext'>
                    <h3>Have Your Best Chat</h3>
                </div>
            </div>
            <div className='homepage-imagecontainer'>
                <img src={Picture} />
            </div>
        </div>
    )
}

export default HomePage;
