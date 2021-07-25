import { React, useState } from 'react'

import './ChatContainer.css';
import { useParams } from 'react-router-dom'
import Data from '../Data/dummy';

function ChatContainer(Probs) {

    const [inputvalue, setinputvalue] = useState('')

    //Specific Id of the User
    let userid = 'u1';
    let params = useParams();
    // Fetch data of User from this side
    const User = Data.filter((data) => data.id === userid)
    console.log(User);
    //Data of all the friends awalable of this user
    const FriendList = User[0].Friend;
    // Data of opponent user of param id(Opponent)
    const UserData = FriendList.filter((data) => data.id === params.params)

    const SubmitHandler = (e) => {
        e.preventDefault();
        console.log('Send Button is clicked!!!')
        UserData[0].Messages.push({To: params.params, From: userid, Msg: inputvalue})
        setinputvalue('')
    }

    const InputHandler = (e) => {
        setinputvalue(e.target.value)
    }

    return (
        <div className='chatcontainer-maincontainer'>
            <div className='chatcontainer-nameuser'>
                <h3>{UserData[0].Name}</h3>
            </div>
            <div className='chatcontainer-chatarea'>
                <ul>
                    {UserData[0].Messages.map((data, index) => {
                        if (data.From !== params.params) {
                            return <div key={index} className='msgcontainer'><li className='sender'>{data.Msg}</li></div>
                        } else {
                            return <div key={index} className='msgcontainer'><li className='receiver'>{data.Msg}</li></div>
                        }
                    })}
                </ul>
            </div>
            <form className='chatcontainer-message'>
                <div className='sendmessage-container'>
                    <input onChange={InputHandler} value={inputvalue} placeholder='Type your message here...'></input>
                </div>
                <div className='sendbutton-container'>
                    <button type='submit' onClick={SubmitHandler}>Send</button>
                </div>
            </form>
        </div>
    )
}

export default ChatContainer;
