import { React, useContext, useState } from 'react'
import { NavLink } from 'react-router-dom';

import './UserList.css';
import Data from '../Data/dummy';
import { AuthContext } from '../Context/AuthContext';

function UserList(Probs) {

    const Auth = useContext(AuthContext)
    // Fetch data of User from this side
    const User = Data.filter((data) => data.id === Auth.UserId)
    //Data of all the friends awalable of this user
    const FriendList = User[0].Friend;
    console.log(FriendList);

    const [PhoneNo, SetPhoneNo] = useState('');
    const [Addform, Setaddform] = useState(false)

    const Phonehandler = (e) => {
        SetPhoneNo(e.target.value)
    }

    const AddFriendHandler = (e) => {
        e.preventDefault();
        const test = Data.filter((data) => data.PhoneNo === PhoneNo);
        const NewFriend = {id: test[0].id , Name: test[0].Name, Messages: []};
        FriendList.push(NewFriend);
        SetPhoneNo('')
        Setaddform(false);
    }

    const AddFriendform = () => {
        if(Addform) {
            Setaddform(false)
        } else {
            Setaddform(true)
        }
    }

    return (
        <div className='userlist-maincontainer'>
            <div className='userlist-chattext'>
                <h2>Chat</h2>
                <button id='addbutton' onClick={AddFriendform} >Add +</button>
                {Addform && <div className='userlist-form'>
                    <div className='userlist-formcontainer'>
                        <div className='adduserform'>
                            <div>
                                <form id='userlistform'>
                                    <label>Phone No.</label>
                                    <input value={PhoneNo} onChange={Phonehandler} type="number" placeholder='Enter Your Friend Number'></input>
                                    <button onClick={AddFriendHandler} type='submit'>ADD</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            <div className='userlist-list'>
                {FriendList.map((data) => (<NavLink to={{ pathname: `/home/${data.id}`, data: data }} activeClassName='active' key={data.id}>{data.Name}</NavLink>))}
            </div>
        </div>
    )
}

export default UserList;
