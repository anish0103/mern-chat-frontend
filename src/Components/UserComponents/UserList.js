import { React, useContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';

import './UserList.css';
import ErrorModal from '../ErrorModal/ErrorModal';
import { AuthContext } from '../Context/AuthContext';

function UserList(Probs) {

    const [PhoneNo, SetPhoneNo] = useState('');
    const [Addform, Setaddform] = useState(false)
    const [Error, SetError] = useState(false)
    const [ErrorContent, SetErrorContent] = useState();
    const [Users, SetUsers] = useState()

    useEffect(() => {
        const GetUsers = async () => {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/')
            const data = await response.json()
            SetUsers(data);
        }
        GetUsers();
    }, [])

    const UserInfo = async () => {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/')
        const data = await response.json()
        const UserData = data.filter((data)=> data._id === Auth.UserId)
        Auth.UserDataHandler(UserData[0]);
    }

    const Auth = useContext(AuthContext)
    let FriendList=[];

    if(Auth.UserData === undefined) {
        UserInfo();
        console.log(process.env.REACT_APP_BACKEND_URL);
    } else {
        FriendList = Auth.UserData.Friend;
    }

    const Phonehandler = (e) => {
        SetPhoneNo(e.target.value)
    }

    const AddFriendFunction = async (data) => {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/addfriend/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const userdata = await response.json()
        Auth.UserDataHandler(userdata);
    }

    const AddFriendHandler = (e) => {
        e.preventDefault();
        const test = Users.filter((data) => data.PhoneNo === PhoneNo);
        if (test.length === 0) {
            SetErrorContent(`The user you want to add don't have account in this Application. If You want to talk tell him/her to SignUp`);
            return SetError(true);
        }
        console.log(test)
        const NewFriend = { id: test[0]._id, Userid: Auth.UserId };
        AddFriendFunction(NewFriend);
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
