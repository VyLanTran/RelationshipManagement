import React, { useState } from "react";
import Icon from "react-icons-kit";
import { Link, Navigate } from "react-router-dom";
import { SocialIcon } from 'react-social-icons';
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import axios from "axios";
import { useSignup } from "../hooks/useSignup";
import { FcGoogle } from "react-icons/fc";


const SignUp: React.FC = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { signup, isLoading, error } = useSignup()
    // Show/hide Password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(firstName, lastName, email, username, password, confirmPassword)
    }

    return (
        <header className="App-login" >
            <form
                className="w-full h-[100vh] flex justify-center items-center overflow-hidden"
                onSubmit={handleSubmit}
            >
                <div className="bg-slate-50 w-2/5 flex flex-col items-center gap-3 justify-center py-10">
                    <h3 className="text-[40px]">Sign up</h3>
                    <div className="grid grid-cols-2 w-[70%] gap-4">
                        <input
                            className="textStyles outline-none w-full border-black"
                            placeholder="First name*"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            className="textStyles outline-none w-full border-black"
                            placeholder="Last name*"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <input
                        className="textStyles outline-none  border-black"
                        placeholder="Email* "
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="textStyles outline-none  border-black"
                        placeholder="Username*"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div
                        className="textStyles relative outline-none border-black"
                    >
                        <input
                            className="bg-slate-50 w-[100%] outline-none"
                            placeholder="Password*"
                            type={showPassword ? "text" : "password"}
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
                    <div className="textStyles relative outline-none  border-black">
                        <input
                            className="bg-slate-50 w-[100%] outline-none"
                            placeholder="Confirm password*"
                            type={showConfirmPassword ? "text" : "password"}
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
                    <div className=" w-[70%] flex h-16">
                        {
                            error &&
                            <div className="text-[14px] mr-auto text-red-600">
                                {error}
                            </div>
                        }
                    </div>

                    <button
                        className="font-azeret bg-[#FFB302] w-[20vh] text-[large] font-bold border h-[7vh] mb-[-2vh] mt-[-10vh] rounded-[5px] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                        disabled={isLoading}
                    >
                        Sign up
                    </button>
                    <div className="mt-[2vh] flex flex-row gap-3">
                        <span>
                            Already have an account?
                        </span>
                        <Link to="/" className="text-[#FFB302]">
                            <span>
                                Log in
                            </span>
                        </Link>
                    </div>

                    {/* TODO: Login using third-party */}
                    <div className="w-3/5 flex justify-around mt-[1vh]">
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://mail.google.com" /> {/* Can be resized by: style={{ width:"30vh", height:"30vh" }}, just make sure height and width are the same */}
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://facebook.com" />
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://instagram.com" />
                    </div>
                </div>
            </form>
        </header >
    );
}

export default SignUp;