import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext, useUserContext } from '../context/user.context'
import axios from '../config/axios'
import { Spotlight } from '../components/ui/spotlight-new.jsx'
import toast from 'react-hot-toast'

const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setToken,setUser, navigate } = useUserContext();

    function submitHandler(e) {

        e.preventDefault()

        const signres = axios.post('/users/register', {
            email,
            password
        }).then((res) => {
            toast.success('Registration Successful!', {
                style: {
                    border: '1px solid #52525B',
                    padding: '16px',
                    color: '#EAB308',
                    background: '#18181B'
                },
                iconTheme: {
                    primary: '#EAB308',
                    secondary: '#52525B',
                },
            });

            const loginres = axios.post('/users/login', {
                email,
                password
            }).then((res) => {

                toast.success('Successfully Logged In', {
                    style: {
                        border: '1px solid #52525B',
                        padding: '16px',
                        color: '#EAB308',
                        background: '#18181B'
                    },
                    iconTheme: {
                        primary: '#EAB308',
                        secondary: '#52525B',
                    },
                });

                console.log(res.data)
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                setToken(res.data.token)
                setUser(res.data.user)
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                navigate('/')
            }).catch((err) => {
                toast.error(err.response?.data?.message, {
                    style: {
                      border: '1px solid #52525B',
                      padding: '16px',
                      color: '#EF4444',
                      background: '#18181B'
                    },
                    iconTheme: {
                      primary: '#EAB308',
                      secondary: '#EF4444',
                    },
                  }); 
            })
        }).catch((err) => {
            
            toast.error(err.response?.data?.message || "Login failed", {
                style: {
                    border: '1px solid #52525B',
                    padding: '16px',
                    color: '#EF4444',
                    background: '#18181B'
                },
                iconTheme: {
                    primary: '#EAB308',
                    secondary: '#EF4444',
                },
            });
        })
    }


    return (
            <div className="min-h-screen duration-500 relative overflow-hidden flex flex-col items-center justify-center bg-zinc-950">

                <Spotlight
                    gradientFirst='radial-gradient(
                        55% 100% at 50% 20%,
                        rgba(59, 130, 246, 0.5) 0%,
                        rgba(59, 130, 246, 0.14) 45%,
                        rgba(59, 130, 246, 0.05) 70%,
                        rgba(59, 130, 246, 0) 100%
                      )'
                />

                <div className="logo flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="logo" className="w-24 h-24 mb-4" />
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent hand">
                        Kothamala Ai
                    </p>

                </div>


                <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-600 w-full max-w-md">
                    <span className="text-3xl font-bold bg-gradient-to-b from-yellow-500 from-60% to-zinc-200/10 bg-clip-text text-transparent">Register</span>
                    <form
                        className='mt-4'
                        onSubmit={submitHandler}
                    >
                        <div className="mb-4">
                            <label className="block text-base text-blue-500 mb-2" htmlFor="email">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                id="email"
                                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 text-blue-300 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-base text-blue-500 mb-2" htmlFor="password">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 text-blue-300 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="cursor-pointer w-full p-3 rounded-xl relative text-white  bg-transparent focus:outline-none group overflow-hidden z-10 duration-500"
                        >
                            <span className='relative text-lg font-semibold text-blue-900 group-hover:text-white duration-300 z-9 '>Register</span>
                            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-blue-500 from-30% z-0 to-yellow-500 to-60% top-0 -left-70 duration-500 group-hover:left-0"></div>

                        </button>
                    </form>
                    <p className="text-zinc-400 mt-4">
                        Already have an account? <Link to="/login" className="text-yellow-500 hover:text-blue-500 duration-300 hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        )
    }

    export default Register