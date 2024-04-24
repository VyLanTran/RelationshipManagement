import React, { useState } from 'react'
import Icon from 'react-icons-kit'
import { Link, useNavigate } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'
import { eye } from 'react-icons-kit/feather/eye'
import { useSignup } from '../hooks/useSignup'
import { setLogin } from '../store/authReducer'
import OAuth2Login from 'react-simple-oauth2-login'

import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useDispatch } from 'react-redux'

const SignUp = () => {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { signup, isLoading, error } = useSignup()
    // Show/hide Password
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const dispatch = useDispatch()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await signup(name, email, username, password, confirmPassword)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const onSuccess = async (res) => {
        try {
            const accessToken = await res.access_token
            const fbRes = await fetch(
                `https://graph.facebook.com/me?fields=id,name,picture.type(large)&access_token=${accessToken}`
            )
            const profile = await fbRes.json()

            console.log('my profile: ', profile)

            const result = await fetch(`http://localhost:3001/auth/facebook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // indicate the body of request is json
                body: JSON.stringify({
                    facebookId: profile.id,
                    name: profile.name,
                    email: 'email@gmail.com',
                    username: 'username',
                    password: 'password',
                    //     // handle avatar
                    //     // profilePicture: profile.picture.data.url
                }),
            })

            const json = await result.json()

            if (!result.ok) {
                // throw Error(json.error)
                console.log('not ok')
            } else {
                dispatch(
                    setLogin({
                        user: json.user,
                        token: json.token,
                    })
                )
            }

            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const onFailure = (res) => {
        console.log(res)
    }

    return (
        <header>
            <div
                // className="w-full h-[100vh] flex justify-center items-center overflow-hidden"
                className="w-full h-screen flex justify-center items-center"
            >
                <div className="bg-slate-50 flex flex-col items-center gap-2 rounded-[20px] justify-center py-2 pb-8 w-4/5 sm:w-2/5">
                    <h3 className="font-azeret text-[40px] mb-6">Sign Up</h3>
                    <input
                        className="textStyles outline-none  "
                        placeholder="Display name* "
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="textStyles outline-none  "
                        placeholder="Email* "
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="textStyles outline-none  "
                        placeholder="Username*"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="relative w-[70%] textStyles">
                        <input
                            className="bg-slate-50 w-[100%] outline-none"
                            placeholder="Password*"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-[3vh]"
                        >
                            <Icon icon={showPassword ? eye : eyeOff} />
                        </button>
                    </div>
                    <div className="relative w-[70%] textStyles">
                        <input
                            className="bg-slate-50 w-[100%] outline-none"
                            placeholder="Confirm password*"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-[3vh]"
                        >
                            <Icon icon={showConfirmPassword ? eye : eyeOff} />
                        </button>
                    </div>
                    {/* TODO: replace with toast */}
                    {/* <div className=" w-[70%] flex h-16">
                        {error && (
                            <div className="text-[14px] mr-auto text-red-600">
                                {error}
                            </div>
                        )}
                    </div> */}

                    <button
                        type="submit"
                        className="font-azeret bg-[#FFB302] hover:bg-[#ffc235] w-[70%] text-[12px] font-bold  h-[6vh] shadow-sm mt-4 rounded-[5px] hover:cursor-pointer"
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        Sign up
                    </button>

                    <div className="mt-[2vh] flex flex-row gap-3 text-[13px]">
                        <span>Already have an account?</span>
                        <Link to="/login" className="text-[#FFB302]">
                            <span>Log in</span>
                        </Link>
                    </div>

                    <div class="relative flex py-5 items-center w-[70%] text-[11px]">
                        <div class="flex-grow border-t border-gray-300"></div>
                        <span class="flex-shrink mx-4 text-gray-400">OR</span>
                        <div class="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        type="submit"
                        className="font-azeret bg-[#3b5998] hover:bg-[#4162a8] text-white w-[70%] text-[12px] font-bold  h-[6vh] shadow-sm rounded-[5px] hover:cursor-pointer flex flex-row justify-center items-center gap-4"
                        disabled={isLoading}
                    >
                        <FaFacebook size={16} />
                        <OAuth2Login
                            buttonText="Sign up with Facebook"
                            authorizationUrl="https://www.facebook.com/dialog/oauth"
                            responseType="token"
                            clientId="733349588684421"
                            redirectUri="http://localhost:3000/"
                            scope="public_profile"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                        />
                    </button>

                    <button
                        type="submit"
                        className="font-azeret bg-white hover:bg-gray-200 text-gray-500 w-[70%] text-[12px] font-semibold  h-[6vh]  mb-[-2vh] border border-gray-300 border-1 rounded-[5px] hover:cursor-pointer flex flex-row justify-center items-center gap-4"
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        <FcGoogle size={16} />
                        Sign up with Google
                    </button>
                </div>
            </div>
        </header>
    )
}

export default SignUp
