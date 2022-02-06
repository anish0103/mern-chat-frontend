import { React, useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import FileBase from "react-file-base64";

import './LoginPage.css';
import ErrorModal from '../ErrorModal/ErrorModal';
import { AuthContext } from '../Context/AuthContext';

function LoginPage(Probs) {
    const Auth = useContext(AuthContext)
    const namevalid = "^[a-zA-Z.,?\\s]*$";
    const emailvalid = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";

    const [Name, SetName] = useState('');
    const [PhoneNo, SetPhoneNo] = useState('');
    const [Password, SetPassword] = useState('');
    const [Image, SetImage] = useState('');
    const [Email, SetEmail] = useState('');
    const [Mode, setMode] = useState(false)
    const [Error, SetError] = useState(false)
    const [ErrorContent, SetErrorContent] = useState();
    const [Users, SetUsers] = useState('')

    useEffect(() => {
        const GetUsers = async () => {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/')
            const data = await response.json()
            SetUsers(data);
        }
        GetUsers();
    }, [])

    const Namehandler = (e) => {
        SetName(e.target.value)
    }
    const Phonehandler = (e) => {
        SetPhoneNo(e.target.value)
    }
    const PasswordHandler = (e) => {
        SetPassword(e.target.value)
    }
    const Emailhandler = (e) => {
        SetEmail(e.target.value)
    }

    const SignUpFunction = async () => {
        const data = { Name: Name, PhoneNo: PhoneNo, Password: Password, Image: Image.base64, EmailId: Email };
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/signup/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const userdata = await response.json()
        if (response.ok) {
            if (userdata === undefined) {
                SetErrorContent(userdata.Message);
                return SetError(true);
            } else {
                Probs.StorageHandler(userdata);
                Auth.IdHandler(userdata._id);
                Auth.UserDataHandler(userdata);
                Auth.login();
                SetName('')
                SetPhoneNo('')
                SetPassword('')
                SetEmail('')
            }
        } else {
            SetErrorContent('Something Went Wrong. Please Try Sometime Later!');
            return SetError(true);
        }
    }

    const SignUpHandler = (e) => {
        //creating a user
        e.preventDefault();
        //checking for data validation in signup form
        if (!Name.match(namevalid) || PhoneNo.length > 10 || PhoneNo.length < 10 || Password.trim().length === 0 || Name.trim().length === 0 || !Email.match(emailvalid)) {
            SetErrorContent('Please Enter Valid Data');
            return SetError(true);
        }
        const ExistingUser = Users.filter((data) => data.PhoneNo === PhoneNo)
        if (ExistingUser.length !== 0) {
            SetErrorContent('User Already Exist!!');
            return SetError(true);
        }
        // Passing Data for SignUp Process
        SignUpFunction();
    }

    const SignInFunction = async (data) => {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/login/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const userdata = await response.json()
        if (response.ok) {
            if (userdata[0] === undefined) {
                SetErrorContent(userdata.Message);
                return SetError(true);
            } else {
                Probs.StorageHandler(userdata[0]);
                Auth.UserDataHandler(userdata[0]);
                Auth.IdHandler(userdata[0]._id);
                Auth.login();
            }
        } else {
            SetErrorContent('Please Valid Credentials!!');
            return SetError(true);
        }
    }

    const SignInHandler = (e) => {
        //checking of user exist or not
        e.preventDefault();
        const Data = { PhoneNo: PhoneNo, Password: Password }
        //passing Data to SignIn Process
        SignInFunction(Data);
    }

    let content;
    if (!Mode) {
        content = "Go to SignUp Page"
    } else {
        content = "Already have account??"
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
                            {Mode && <><label>Name</label>
                                <input value={Name} onChange={Namehandler} type="text" placeholder='Enter Your Name'></input>
                                <label>Phone No.</label>
                                <input value={PhoneNo} onChange={Phonehandler} type="number" placeholder='Enter Your Number'></input>
                                <label>Email Id</label>
                                <input value={Email} onChange={Emailhandler} type="email" placeholder='Enter Your Email Id'></input>
                                <label>Password</label>
                                <input value={Password} onChange={PasswordHandler} type="Password" placeholder='Enter Your Password'></input>
                                <label>Profile Photo</label>
                                <FileBase
                                    type="file"
                                    name="File"
                                    multiple={false}
                                    onDone={({ base64 }) => SetImage({ base64 })}
                                />
                                <button onClick={SignUpHandler} type='submit'>SignUp</button></>}
                            {!Mode && <><label>Phone No.</label>
                                <input value={PhoneNo} onChange={Phonehandler} type="number" placeholder='Enter Your Number'></input>
                                <label>Password</label>
                                <input value={Password} onChange={PasswordHandler} type="Password" placeholder='Enter Your Password'></input>
                                <button onClick={SignInHandler} type='submit'>SignIn</button>
                                <Link to="/Forget" >Forget Password??</Link>
                            </>}
                            <button onClick={ModeHandler}>{content}</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;