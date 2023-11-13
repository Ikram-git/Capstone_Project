import React,{useState} from 'react'
import {auth,fs} from '../Config/Config'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'

export const Signup = () => {

    const history = useHistory();

    const [fullName, setFullname]=useState('');
    const [email, setEmail]=useState('');
    const [phoneNumber, setPhoneNumber]=useState('');
    const [password, setPassword]=useState('');

    const [signupType, setSignupType] = useState('email');
    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleSignup=(e)=>{
        e.preventDefault();
        if(signupType === 'email') {
            auth.createUserWithEmailAndPassword(email,password).then((credentials)=>{
                console.log(credentials);
                fs.collection('users').doc(credentials.user.uid).set({
                    FullName: fullName,
                    Email: email,
                    Password: password
                }).then(()=>{
                    setSuccessMsg('Signup Successfull. You will now automatically get redirected to Login');
                    setFullname('');
                    setEmail('');
                    setPhoneNumber('');
                    setPassword('');
                    setErrorMsg('');
                    setTimeout(()=>{
                        setSuccessMsg('');
                        history.push('/login');
                    },3000)
                }).catch(error=>setErrorMsg(error.message));
            }).catch((error)=>{
                setErrorMsg(error.message)
            })
        } else {
            // signup with phone number
            auth.createUserWithEmailAndPassword(`${phoneNumber}@example.com`, password).then((credentials)=>{
                console.log(credentials);
                fs.collection('users').doc(credentials.user.uid).set({
                    FullName: fullName,
                    PhoneNumber: phoneNumber,
                    Password: password
                }).then(()=>{
                    setSuccessMsg('Signup Successfull. You will now automatically get redirected to Login');
                    setFullname('');
                    setEmail('');
                    setPhoneNumber('');
                    setPassword('');
                    setErrorMsg('');
                    setTimeout(()=>{
                        setSuccessMsg('');
                        history.push('/login');
                    },3000)
                }).catch(error=>setErrorMsg(error.message));
            }).catch((error)=>{
                setErrorMsg(error.message)
            })
        }
    }

    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Sign Up</h1>
            <hr></hr>
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
            <form className='form-group' autoComplete="off" onSubmit={handleSignup}>
                <label>Full Name</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setFullname(e.target.value)} value={fullName}></input>
                <br></br>
                {signupType === 'email' ? 
                    <div>
                        <label>Email</label>
                        <input type="email" className='form-control' required
                            onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                        <br></br>
                    </div>
                    :
                    <div>
                        <label>Phone Number</label>
                        <input type="tel" className='form-control' required
                            onChange={(e)=>setPhoneNumber(e.target.value)} value={phoneNumber}></input>
                        <br></br>
                    </div>
                }
                <label>Password</label>
                <input type="password" className='form-control' required
                 onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br></br>
                <div className='btn-box'>
                    <span>Already have an account? Login
                    <Link to="login" className='link'> Here</Link></span>
                    <button type="submit" className='btn btn-success btn-md'>SIGN UP</button>
                </div>
                <div className='btn-box'>
                    <span>Sign up with 
                        {signupType === 'email' ? 
                            <Link type='button' className='link-btn' onClick={()=>setSignupType('phone')}> Phone number</Link>
                            :
                            <Link type='button' className='link-btn' onClick={()=>setSignupType('email')}> Email</Link>
                        }
                    </span>
                </div>
            </form>
            {errorMsg&&<>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>                
            </>}
        </div>
    )
}