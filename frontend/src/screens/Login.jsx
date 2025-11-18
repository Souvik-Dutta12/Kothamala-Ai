import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'
import { Spotlight } from '../components/ui/spotlight-new.jsx'


const Login = () => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()

    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data)

            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)

            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
        })
    }

    return (
        <div className="min-h-screen duration-500 overflow-hidden flex flex-col items-center relative justify-center bg-zinc-950">


            <Spotlight
                gradientFirst='radial-gradient(
                    55% 100% at 50% 20%,
                    rgba(250, 204, 21, 0.5) 0%,
                    rgba(250, 204, 21, 0.14) 45%,
                    rgba(250, 204, 21, 0.05) 70%,
                    rgba(250, 204, 21, 0) 100%
                  )
                  
                  '


            />


            <div className="logo flex flex-col items-center mb-8">
                <img src="/logo.png" alt="logo" className="w-24 h-24 mb-4" />
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent hand">
                    Kothamala Ai
                </p>

            </div>


            <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-600 w-full max-w-md">
                <span className="text-3xl font-bold bg-gradient-to-b from-blue-500 from-60% to-zinc-200/10 bg-clip-text text-transparent ">Login</span>
                <form
                    className='mt-3'
                    onSubmit={submitHandler}
                >
                    <div className="mb-4">
                        <label className="block text-base text-yellow-500 mb-2" htmlFor="email">Email</label>
                        <input

                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 text-yellow-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="kothamalaai@2025.com"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-yellow-500 text-base mb-2" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 text-yellow-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="KothamalaAi@2025"
                        />
                    </div>
                    <button
                        type="submit"
                        className="cursor-pointer w-full p-3 rounded-xl relative text-white  bg-transparent focus:outline-none group overflow-hidden z-10 duration-500"
                    >
                        <span className="relative text-lg font-semibold text-white group-hover:text-blue-900 duartion-300 z-9 ">Login</span>

                        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-blue-500 from-30% z-0 to-yellow-500 to-60% top-0 left-0 duration-500 group-hover:-left-70"></div>
                    </button>

                </form>
                <p className="text-zinc-400 mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:text-yellow-500 duration-300 hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    )
}

export default Login