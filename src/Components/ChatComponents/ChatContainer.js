import { React, useState, useContext } from 'react'

import './ChatContainer.css';
import { AuthContext } from '../Context/AuthContext';
import { useParams } from 'react-router-dom'
import Data from '../Data/dummy';

function ChatContainer(Probs) {

    const Auth = useContext(AuthContext)
    const [inputvalue, setinputvalue] = useState('')

    //Specific Id of the User
    let userid = Auth.UserId;
    let params = useParams();
    // Fetch data of User from this side
    const User = Data.filter((data) => data.id === userid)
    //Data of all the friends awalable of this user
    const FriendList = User[0].Friend;
    // Data of opponent user of param id(Opponent)
    const UserData = FriendList.filter((data) => data.id === params.params)

    let Timer;
    const StopScroller = () => {
        clearTimeout(Timer);
    }

    const ScrollerHandler = () => {
        let elem = document.getElementById('chatbox');
        let testing = elem.offsetHeight;
        elem.scrollTo(0, testing)
        StopScroller();
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        //Input Data
        const InputData = {To: params.params, From: userid, Msg: inputvalue}
        UserData[0].Messages.push(InputData);
        setinputvalue('')
        Timer = setInterval(ScrollerHandler, 100); 
    }

    const InputHandler = (e) => {
        setinputvalue(e.target.value)
        // let elem = document.getElementById('chatbox');
        // elem.scrollTo(0, 10000);
    }

    return (
        <div className='chatcontainer-maincontainer'>
            <div className='chatcontainer-nameuser'>
                <h3>{UserData[0].Name}</h3>
            </div>
            <div id='chatbox' className='chatcontainer-chatarea'>
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
