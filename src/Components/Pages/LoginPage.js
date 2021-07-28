import { React, useState, useContext } from 'react'

import './LoginPage.css';
import Data from '../Data/dummy';
import ErrorModal from '../ErrorModal/ErrorModal';
import { AuthContext } from '../Context/AuthContext';

function LoginPage(Probs) {
    const Auth = useContext(AuthContext)
    const namevalid = "^[a-zA-Z.,?\\s]*$";

    const [Name, SetName] = useState('');
    const [PhoneNo, SetPhoneNo] = useState('');
    const [Password, SetPassword] = useState('');
    const [Mode, setMode] = useState(false)
    const [Error, SetError] = useState(false)
    const [ErrorContent, SetErrorContent] = useState();

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
        //checking for data validation in signup form
        if (!Name.match(namevalid) || PhoneNo.length > 10 || PhoneNo.length < 10 || Password.trim().length === 0 || Name.trim().length === 0) {
            // return console.log('Invalid Data!!!')
            SetErrorContent('Please Enter Valid Data');
            return SetError(true);
        }
        const CreatedUser = { Name: Name, Password: Password, PhoneNo: PhoneNo, id: 't1', Friend: [] }
        // console.log(CreatedUser);
        Data.push(CreatedUser);
        Auth.IdHandler('t1');
        Auth.login();
        Probs.StorageHandler(CreatedUser);
        SetName('')
        SetPhoneNo('')
        SetPassword('')
    }

    const SignInHandler = (e) => {
        //checking of user exist or not
        e.preventDefault();
        const User = Data.filter((data) => data.PhoneNo === PhoneNo)
        //if not then return error modal
        if (User.length === 0) {
            // return console.log('User Not found');
            SetErrorContent('Please Enter Valid Data');
            return SetError(true);
        }
        if (User[0].Password === Password) {
            Probs.StorageHandler(User[0]);
            Auth.IdHandler(User[0].id);
            Auth.login();
        } else {
            SetErrorContent('Invalid Credentail. Please Provide correct Data');
            return SetError(true);
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

    const ModalHandler = () => {
        SetError(false)
    }

    return (
        <>
            <ErrorModal visible={Error} title={'Error'} content={ErrorContent} ModalHandler={ModalHandler} />
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
        </>
    )
}

export default LoginPage;
