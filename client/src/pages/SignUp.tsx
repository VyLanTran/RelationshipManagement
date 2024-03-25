import React, { useState } from "react";
import Icon from "react-icons-kit";
import { Link, Navigate } from "react-router-dom";
import { SocialIcon } from 'react-social-icons';
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

const SignUp: React.FC = () => {

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    // Show/hide Password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const res = await axios.post(`${baseUrl}/register`, {
    //             email,
    //             password,
    //         });
    //         Navigate(`/${res.data["id"]}/contacts`)
    //     }
    //     catch (error) {
    //         // setMessage(error.response.data["message"])
    //         console.log('Sign up failed')
    //     }
    // }

    return (
        <header className="App-login">
            <form
                className="w-full h-screen flex justify-center items-center"
            // onSubmit={handleSubmit}
            >
                <div className="bg-slate-50  w-2/5 flex flex-col items-center gap-3 rounded-[30px] justify-center py-10">
                    <h3 style={{ fontSize: '8vh' }}>Sign up</h3>
                    <input
                        className="textStyles outline-none"
                        placeholder="Email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="textStyles outline-none"
                        placeholder="Username"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="relative w-[70%]">
                        <input
                            className="textStyles w-[100%] outline-none"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute mt-[2.2vh] right-[3vh]"
                        >
                            <Icon icon={showPassword ? eye : eyeOff} />
                        </button>
                    </div>
                    <div className="relative w-[70%]">
                        <input
                            className="textStyles w-[100%] outline-none"
                            placeholder="Confirm password"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute mt-[2.2vh] right-[3vh]"
                        >
                            <Icon icon={showConfirmPassword ? eye : eyeOff} />
                        </button>
                    </div>

                    <input className="font-azeret bg-[#FFB302] w-[20vh] text-[large] font-bold border h-[7vh] mb-[-2vh] mt-[1vh] rounded-[5px] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]" type="submit" value="Sign up" />
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
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://mail.google.com" />
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://facebook.com" />
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://instagram.com" />
                    </div>
                </div>
            </form>
        </header >
    );
}

export default SignUp;