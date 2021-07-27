import { React, useState, useContext } from 'react'

import './LoginPage.css';
import Data from '../Data/dummy';
import { AuthContext } from '../Context/AuthContext';

function LoginPage() {
    const Auth = useContext(AuthContext)

    const [Name, SetName] = useState('');
    const [PhoneNo, SetPhoneNo] = useState('');
    const [Password, SetPassword] = useState('');
    const [Mode, setMode] = useState(false)

    const Namehandler = (e) => {
        SetName(e.target.value)
    }
    const Phonehandler = (e) => {
        SetPhoneNo(e.target.value)
    }
    const PasswordHandler = (e) => {
        SetPassword(e.target.value)
    }

    const SignUpHandler = (e) => {
        //creating a user
        e.preventDefault();
        const CreatedUser = { Name: Name, Password: Password, PhoneNo: PhoneNo, id: 't1', Friend: [] }
        // console.log(CreatedUser);
        Data.push(CreatedUser);
        Auth.IdHandler('t1');
        Auth.login();
        SetName('')
        SetPhoneNo('')
        SetPassword('')
    }

    const SignInHandler = (e) => {
        //checking of user exist or not
        e.preventDefault();
        const User = Data.filter((data) => data.PhoneNo === PhoneNo)
        if (User[0].Password === Password) {
            Auth.IdHandler(User[0].id);
            Auth.login();
        }
    }

    let content;
    if (!Mode) {
        content = "Already have account??"
    } else {
        content = "Go to SignUp Page"
    }

    const ModeHandler = (e) => {
        e.preventDefault();
        if (!Mode) {
            setMode(true)
        } else {
            setMode(false)
        }
    }

    return (
        <div className='contact-formcontainer'>
            <div className='formcontainer'>
                <div>
                    <form>
                        {!Mode && <><label>Name</label>
                            <input value={Name} onChange={Namehandler} type="text" placeholder='Enter Your Name'></input>
                            <label>Phone No.</label>
                            <input value={PhoneNo} onChange={Phonehandler} type="number" placeholder='Enter Your Number'></input>
                            <label>Password</label>
                            <input value={Password} onChange={PasswordHandler} type="Password" placeholder='Enter Your Password'></input>
                            <button onClick={SignUpHandler} type='submit'>SignUp</button></>}
                        {Mode && <><label>Phone No.</label>
                            <input value={PhoneNo} onChange={Phonehandler} type="number" placeholder='Enter Your Number'></input>
                            <label>Password</label>
                            <input value={Password} onChange={PasswordHandler} type="Password" placeholder='Enter Your Password'></input>
                            <button onClick={SignInHandler} type='submit'>SignIn</button></>}
                        <button onClick={ModeHandler}>{content}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
