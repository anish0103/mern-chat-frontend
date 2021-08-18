import { React, useState, useContext, useEffect } from 'react'

import './LoginPage.css';
import ErrorModal from '../ErrorModal/ErrorModal';
import { AuthContext } from '../Context/AuthContext';

function LoginPage(Probs) {
    const Auth = useContext(AuthContext)
    const namevalid = "^[a-zA-Z.,?\\s]*$";

    const [Name, SetName] = useState('');
    const [PhoneNo, SetPhoneNo] = useState('');
    const [Password, SetPassword] = useState('');
    const [Image, SetImage] = useState('');
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

    const FileHandler = (e) => {
        SetImage(e.target.files[0])
    }

    const SignUpFunction = async () => {
        const data = new FormData();
        data.append("Name", Name)
        data.append("PhoneNo", PhoneNo)
        data.append("Password", Password)
        data.append("Image", Image)
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/signup/', {
            method: 'POST',
            body: data,
        })

        const userdata = await response.json()
        console.log(userdata)
        if (response.ok) {
            if (userdata === undefined) {
                SetErrorContent(userdata.Message);
                return SetError(true);
            } else {
                console.log(userdata);
                Probs.StorageHandler(userdata);
                Auth.IdHandler(userdata._id);
                Auth.UserDataHandler(userdata);
                Auth.login();
                SetName('')
                SetPhoneNo('')
                SetPassword('')
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
        if (!Name.match(namevalid) || PhoneNo.length > 10 || PhoneNo.length < 10 || Password.trim().length === 0 || Name.trim().length === 0) {
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
                                <label>Password</label>
                                <input value={Password} onChange={PasswordHandler} type="Password" placeholder='Enter Your Password'></input>
                                <label>Profile Photo</label>
                                <input type="file" onChange={FileHandler} name="image" />
                                <button onClick={SignUpHandler} type='submit'>SignUp</button></>}
                            {!Mode && <><label>Phone No.</label>
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