import { React, useState } from 'react'
import { Redirect } from 'react-router';

import ErrorModal from '../ErrorModal/ErrorModal';

const ForgetPage = () => {

    const emailvalid = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";

    const [EmailPage, SetEmailPage] = useState(true);
    const [OtpPage, SetOptPage] = useState(false);
    const [NewpassPage, SetNewpassPage] = useState(false);
    const [Goto, SetGoto] = useState(false);
    const [Error, SetError] = useState(false);
    const [ErrorContent, SetErrorContent] = useState();
    const [PhoneNo, SetPhoneNo] = useState('');
    const [Password, SetPassword] = useState('');
    const [PasswordConfirm, SetPasswordConfirm] = useState('');
    const [Email, SetEmail] = useState('');
    const [OTP, SetOTP] = useState('');
    const [ResetOTP, SetResetOTP] = useState();

    const Phonehandler = (e) => {
        SetPhoneNo(e.target.value)
    }
    const PasswordHandler = (e) => {
        SetPassword(e.target.value)
    }
    const Emailhandler = (e) => {
        SetEmail(e.target.value)
    }
    const OTPHandler = (e) => {
        SetOTP(e.target.value)
    }
    const PasswordConfirmHandler = (e) => {
        SetPasswordConfirm(e.target.value)
    }

    const OTPGenerator = async (data) => {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/optgenerator/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        const userdata = await response.json()
        if (response.ok) {
            if (userdata.Message !== undefined) {
                SetErrorContent(userdata.Message);
                return SetError(true);
            } else {
                SetResetOTP(userdata.OTP);
                SetEmailPage(false);
                SetOptPage(true);
            }
        }
    }

    const ResetPassword = async (data) => {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/users/newpassword/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        const userdata = await response.json()
        if (response.ok) {
            if (userdata.Message !== undefined) {
                SetErrorContent(userdata.Message);
                return SetError(true);
            } else {
                SetNewpassPage(false);
                SetGoto(true);
            }
        }
    }

    const EmailPageHandler = () => {
        if (PhoneNo.length > 10 || PhoneNo.length < 10 || !Email.match(emailvalid)) {
            SetErrorContent('Please Enter Valid Data');
            return SetError(true);
        }
        const data = { PhoneNo: PhoneNo, EmailId: Email };
        OTPGenerator(data);
    }
    const OptPageHandler = () => {
        if (OTP.trim().length === 0) {
            SetErrorContent('Please Enter some data!');
            return SetError(true);
        }
        if (OTP !== ResetOTP.toString()) {
            SetErrorContent('Incorrect OTP!');
            return SetError(true);
        } else {
            SetOptPage(false);
            SetNewpassPage(true);
        }
    }
    const NewpassPageHandler = () => {
        if (Password.trim().length === 0 || PasswordConfirm.trim().length === 0 || Password !== PasswordConfirm) {
            SetErrorContent('Please Enter Your Password Correctly');
            return SetError(true);
        }
        const data = { Password: Password, PhoneNo: PhoneNo }
        ResetPassword(data)
    }

    const ModalHandler = () => {
        SetError(false)
    }

    return (
        <>
            <ErrorModal visible={Error} title={'Warning!'} content={ErrorContent} ModalHandler={ModalHandler} />
            <div className='contact-formcontainer'>
                <div className='formcontainer'>
                    <form>
                        {EmailPage && <><label>Phone No.</label>
                            <input value={PhoneNo} onChange={Phonehandler} type="number" placeholder='Enter Your Registered Number'></input>
                            <label>Email Id</label>
                            <input value={Email} onChange={Emailhandler} type="email" placeholder='Enter Your Registered Email Id'></input>
                            <button onClick={EmailPageHandler} type='button'>Send OTP</button>
                        </>}
                        {OtpPage && <>
                            <p style={{ textAlign: 'center', margin: '5px' }}>Your will receive one OTP Number on your Registered Email</p>
                            <input value={OTP} onChange={OTPHandler} type="number" placeholder='Enter Your OTP Number Here'></input>
                            <button onClick={OptPageHandler} type='button'>Submit</button>
                        </>}
                        {NewpassPage && <><label>New Password</label>
                            <input value={Password} onChange={PasswordHandler} type="password" placeholder='Enter Your New Password'></input>
                            <label>Confirm Password</label>
                            <input value={PasswordConfirm} onChange={PasswordConfirmHandler} type="password" placeholder='Enter Your Password Again'></input>
                            <button onClick={NewpassPageHandler} type='button'>Confirm</button>
                        </>}
                        {Goto && <Redirect to="/" />}
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgetPage;