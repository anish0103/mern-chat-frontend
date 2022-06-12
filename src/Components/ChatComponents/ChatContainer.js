import { React, useState, useContext, useEffect, useCallback } from 'react'

import './ChatContainer.css';
import DownButton from './downbutton.png'
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
    const [Down, SetDown] = useState(true)
    const [ErrorContent, SetErrorContent] = useState();

    let userid = Auth.UserId;
    let params = useParams();
    const FriendList = Auth.UserData.Friend;
    const UserData = FriendList.filter((data) => data.id === params.params)
    if(Auth.Messages === undefined) {
        Auth.Messages = UserData[0].Messages;
    }

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

    const GetUsers = useCallback(
        async () => {
            fetch(process.env.REACT_APP_BACKEND_URL + `/api/users/${Auth.UserId}/${params.params}`).then((response) => response.json()).then((data) => {
                Auth.MessageHandler(data);
                Timer = setInterval(ScrollerHandler, 100);
            })
        }, [])

    useEffect(() => {
        if (socket) {
            socket.on('resmessage', (data) => {
                GetUsers();
            })
        }
    }, [GetUsers])

    useEffect(() => {
        let elem = document.getElementById('chatbox');
        let CurrentHeight = elem.scrollHeight;
        let TotalHeight = elem.offsetHeight;
        if (CurrentHeight === TotalHeight) {
            SetDown(false)
        }
    }, [])

    const DownButtonHandler = () => {
        Timer = setInterval(ScrollerHandler, 100);
        SetDown(false)
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
        Auth.MessageHandler(userdata)
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
                    <div className="chatcontainer-profile"><img src={UserData[0].Image} /></div>
                    <h3>{UserData[0].Name}</h3>
                </div>
                <div id='chatbox' className='chatcontainer-chatarea'>
                    {Down && <div className='chatcontainer-downbutton'>
                        <img onClick={DownButtonHandler} src={DownButton} alt="Down Arrow" />
                    </div>}
                    <ul>
                        {Auth.Messages.map((data, index) => {
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