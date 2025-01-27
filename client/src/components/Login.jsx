import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios';

const Login = () => {
    const [state, setState] = useState('Login')
    const { setUser, setShowLogin, backendUrl, token, setToken, } = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === 'Login') {
                const response = await axios.post(backendUrl + '/api/user/login', { email, password });
                const data = response.data;

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false);
                    toast.success("Login successfull.");
                } else {
                    toast.error(data.message);
                }
            } else {
                const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
                const data = response.data;

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                    toast.success("User registered successfully.");
                } else {
                    toast.error(data.message);
                }
            }
        } catch (err) {
            if (err.response?.status === 409) {
                toast.info("User already exists, please log in.");
            } else {
                toast.error(err.message)
                console.log('error:', err.message)
            }
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }

    }, [])

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0
     z-10 backdrop-blur-sm bg-black/30 flex
     justify-center items-center'>
            <form
                onSubmit={onSubmitHandler}
                className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700
        font-medium'>{state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>

                {state !== 'Login' && <div className='border px-6 py-2 flex items-center ap-2 rounded-full mt-5'>
                    <img src="/name.png" alt='' className="h-4 text-gray-200" />
                    <input
                        type='text'
                        className='outline-none text-sm px-2'
                        placeholder='Full Name '
                        required
                        onChange={e => setName(e.target.value)}
                        value={name}
                    />
                </div>}

                <div className='border px-6 py-2 flex items-center rounded-full mt-4'>
                    <img src={assets.email_icon} alt='' />
                    <input type='Email'
                        className='outline-none text-sm px-2'
                        placeholder='Email id '
                        required
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className='border px-6 py-2 flex items-center rounded-full mt-4'>
                    <img src={assets.lock_icon} alt='' />
                    <input type='password'
                        className='outline-none text-sm px-2'
                        placeholder='Password '
                        required
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

                <button className='bg-blue-600 w-full text-white py-2 rounded-full '>{state === 'Login' ? 'login' : 'create account'}</button>

                {state === 'Login' ? <p className='mt-5 text-center'>Don't have an account?
                    <span onClick={() => setState('Sign up')} className='text-blue-600 cursor-pointer'> Sign up</span>
                </p>
                    :
                    <p className='mt-5 text-center'>Already have an account?
                        <span onClick={() => setState('Login')} className='text-blue-600 cursor-pointer'> Login</span>
                    </p>}

                <img src={assets.cross_icon} onClick={() => setShowLogin(false)} alt=' ' className='absolute
            top-5 right-5 cursor-pointer'/>
            </form>
        </div>
    )
}

export default Login