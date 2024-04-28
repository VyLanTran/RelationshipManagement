import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from 'react-icons-kit'
import { eyeOff } from 'react-icons-kit/feather/eyeOff'
import { eye } from 'react-icons-kit/feather/eye'
import { useLogin } from '../hooks/useLogin'
import OAuth2Login from 'react-simple-oauth2-login'
import { useDispatch } from 'react-redux'
import { setLogin } from '../store/authReducer'
import {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    FacebookAuthProvider,
} from 'firebase/auth'
import { app } from '../firebase'

import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

// TODO: keep log in for a longer time
const Login = () => {
    // Show/hide Password
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, loginOrSignupWithGoogle, isLoading, error } = useLogin()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const auth = getAuth(app)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    // TODO: show error messagse as in SignUp
    // Login by username or email
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(email, password)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const handleLoginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resGoogle = await signInWithPopup(auth, provider)
            const name = resGoogle.user.displayName
            const email = resGoogle.user.email
            const profilePicture = resGoogle.user.photoURL
            await loginOrSignupWithGoogle(name, email, profilePicture)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const handleLoginWithFacebook = async () => {
        const provider = new FacebookAuthProvider()

        try {
            const resFacebook = await signInWithPopup(auth, provider)
            const name = resFacebook.user.displayName
            const email = resFacebook.user.email
            const profilePicture = resFacebook.user.photoURL

            await loginOrSignupWithGoogle(name, email, profilePicture)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    // const onSuccess = async (res) => {
    //     try {
    //         const accessToken = await res.access_token
    //         const fbRes = await fetch(
    //             `https://graph.facebook.com/me?fields=id,name,picture.type(large)&access_token=${accessToken}`
    //         )
    //         const profile = await fbRes.json()

    //         const result = await fetch(`http://localhost:3001/auth/facebook`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' }, // indicate the body of request is json
    //             body: JSON.stringify({
    //                 facebookId: profile.id,
    //                 name: profile.name,
    //                 email: 'email@gmail.com',
    //                 username: 'username',
    //                 password: 'password',
    //                 //     // handle avatar
    //                 //     // profilePicture: profile.picture.data.url
    //             }),
    //         })

    //         const json = await result.json()

    //         if (!result.ok) {
    //             // throw Error(json.error)
    //             console.log('not ok')
    //         } else {
    //             dispatch(
    //                 setLogin({
    //                     user: json.user,
    //                     token: json.token,
    //                 })
    //             )
    //         }

    //         navigate('/')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const onFailure = (res) => {
    //     console.log(res)
    // }

    return (
        <header>
            <div className="w-full h-screen flex justify-center items-center">
                <div className="bg-slate-50 flex flex-col items-center gap-3 rounded-[20px] justify-center py-10 pb-16 w-4/5 sm:w-2/5">
                    <h3 className="font-azeret text-[40px] mb-6">Log In</h3>
                    <input
                        className="textStyles outline-none"
                        placeholder="Email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative w-[70%] textStyles">
                        <input
                            className="bg-slate-50 w-[100%] outline-none"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password*"
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
                        Log in
                    </button>

                    <div className="mt-[2vh] flex flex-row gap-3 text-[13px]">
                        <span>Don't have an account?</span>
                        <Link to="/signup" className="text-[#FFB302]">
                            <span>Sign up</span>
                        </Link>
                    </div>

                    <div className="relative flex py-5 items-center w-[70%] text-[11px]">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400">
                            OR
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        type="submit"
                        className="font-azeret bg-[#3b5998] hover:bg-[#4162a8] text-white w-[70%] text-[12px] font-bold  h-[6vh] shadow-sm rounded-[5px] hover:cursor-pointer flex flex-row justify-center items-center gap-4"
                        disabled={isLoading}
                        onClick={handleLoginWithFacebook}
                    >
                        <FaFacebook size={16} />
                        {/* <OAuth2Login
                            buttonText="Log in with Facebook"
                            authorizationUrl="https://www.facebook.com/dialog/oauth"
                            responseType="token"
                            clientId="733349588684421"
                            redirectUri="http://localhost:3000/"
                            scope="public_profile"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                        /> */}
                        Log in with Facebook
                    </button>

                    <button
                        type="submit"
                        className="font-azeret bg-white hover:bg-gray-200 text-gray-500 w-[70%] text-[12px] font-semibold  h-[6vh]  mb-[-2vh] border border-gray-300 border-1 rounded-[5px] hover:cursor-pointer flex flex-row justify-center items-center gap-4"
                        disabled={isLoading}
                        onClick={handleLoginWithGoogle}
                    >
                        <FcGoogle size={16} />
                        Log in with Google
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Login
