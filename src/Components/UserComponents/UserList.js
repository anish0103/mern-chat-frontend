import React from 'react'
import { BrowserRouter as Router, NavLink } from 'react-router-dom';

import './UserList.css';
import Data from '../Data/dummy';

function UserList(Probs) {
    console.log(Data[0].Friend)
    const FriendList = Data[0].Friend;
    return (
        <div className='userlist-maincontainer'>
            <div className='userlist-chattext'>
                <h2>Chat</h2>
                <button>Add +</button>
            </div>
            <div className='userlist-list'>
                    {FriendList.map((data) => (<NavLink to={{pathname: `/home/${data.id}` , data: data}} activeClassName='active' key={data.id}>{data.Name}</NavLink> ))}
            </div>
        </div>
    )
}

export default UserList;
