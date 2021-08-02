import { React, useState, useContext, useEffect } from 'react'

import './ChatContainer.css';
import { AuthContext } from '../Context/AuthContext';
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import ErrorModal from '../ErrorModal/ErrorModal';

let socket;
const backend = process.env.REACT_APP_BACKEND_URL

function ChatContainer(Probs) {

    useEffect(() => {
        socket = io(backend)
    }, [])

    const Auth = useContext(AuthContext)
    const [inputvalue, setinputvalue] = useState('')
    const [Error, SetError] = useState(false)
    const [ErrorContent, SetErrorContent] = useState();

    let userid = Auth.UserId;
    let params = useParams();
    const FriendList = Auth.UserData.Friend;
    const UserData = FriendList.filter((data) => data.id === params.params)

    let Timer;
    const StopScroller = () => {
        clearTimeout(Timer);
    }

    const ScrollerHandler = () => {
        let elem = document.getElementById('chatbox');
        let testing = elem.offsetHeight + 100000000;
        elem.scrollTo(0, testing)
        StopScroller();
    }

    const GetUsers = async () => {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/')
        const data = await response.json()
        const UserData = data.filter((data)=> data._id === Auth.UserId)
        Auth.UserDataHandler(UserData[0]);
        Timer = setInterval(ScrollerHandler, 100);
    }

    if(socket) {
        socket.on('resmessage', (data)=>{
            GetUsers();
        })
    }

    const AddMessage = async (data) => {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/addmessage/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        
        const userdata = await response.json()
        setinputvalue('')
        Auth.UserDataHandler(userdata);
        Timer = setInterval(ScrollerHandler, 100);
        socket.emit('sendmessage', data)
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        //Input Data
        if (inputvalue.trim().length === 0) {
            SetErrorContent('Please Enter Some Value');
            return SetError(true);
        }
        const InputData = { To: params.params, From: userid, Msg: inputvalue }
        AddMessage(InputData)
    }

    const InputHandler = (e) => {
        setinputvalue(e.target.value)
    }

    const ModalHandler = () => {
        SetError(false)
    }

    return (
        <>
            <ErrorModal visible={Error} title={'Error'} content={ErrorContent} ModalHandler={ModalHandler} />
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
        </>
    )
}

export default ChatContainer;