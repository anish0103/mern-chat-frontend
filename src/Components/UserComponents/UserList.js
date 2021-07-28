import { React, useContext, useState } from 'react'
import { NavLink } from 'react-router-dom';

import './UserList.css';
import Data from '../Data/dummy';
import ErrorModal from '../ErrorModal/ErrorModal';
import { AuthContext } from '../Context/AuthContext';

function UserList(Probs) {

    const Auth = useContext(AuthContext)
    // Fetch data of User from this side
    const User = Data.filter((data) => data.id === Auth.UserId)
    //Data of all the friends awalable of this user
    const FriendList = User[0].Friend;
    // console.log(FriendList);

    const [PhoneNo, SetPhoneNo] = useState('');
    const [Addform, Setaddform] = useState(false)
    const [Error, SetError] = useState(false)
    const [ErrorContent, SetErrorContent] = useState();

    const Phonehandler = (e) => {
        SetPhoneNo(e.target.value)
    }

    const AddFriendHandler = (e) => {
        e.preventDefault();
        const test = Data.filter((data) => data.PhoneNo === PhoneNo);
        if (test.length === 0) {
            // return console.log('The user you want to add dont have account')
            SetErrorContent(`The user you want to add don't have account in this Application. If You want to talk tell him/her to SignUp`);
            return SetError(true);
        }
        const NewFriend = { id: test[0].id, Name: test[0].Name, Messages: [] };
        FriendList.push(NewFriend);
        SetPhoneNo('')
        Setaddform(false);
    }

    const AddFriendform = () => {
        if (Addform) {
            Setaddform(false)
        } else {
            Setaddform(true)
        }
    }

    const ModalHandler = () => {
        SetError(false)
    }

    return (
        <>
            <ErrorModal visible={Error} title={'Error'} content={ErrorContent} ModalHandler={ModalHandler} />
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
                                        <div className='userlistform-button'>
                                            <button onClick={AddFriendHandler} type='submit'>ADD</button>
                                            <button onClick={AddFriendform} type='submit'>CANCEL</button>
                                        </div>
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
        </>
    )
}

export default UserList;
