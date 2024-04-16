import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    // Show/hide Password
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useLogin()
    const navigate = useNavigate()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
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

    return (
        <header className="App-login">
            <form
                className="w-full h-screen flex justify-center items-center"
                onSubmit={handleSubmit}
            >
                <div className="bg-slate-50 flex flex-col items-center gap-3 rounded-[30px] justify-center py-10 w-4/5 sm:w-2/5">
                    <h3 style={{ fontSize: "8vh", marginTop: "2vh" }}>Log in</h3>
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
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
                    <div className=" w-[70%] flex h-16">
                        {
                            error &&
                            <div className="text-[14px] mr-auto text-red-600">
                                {error}
                            </div>
                        }
                    </div>
                    <button
                        className="font-azeret bg-[#FFB302] w-[20vh] text-[large] font-bold border h-[7vh] mb-[-2vh] mt-[-7.5vh] rounded-[5px] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
                        disabled={isLoading}
                    >
                        Log in
                    </button>
                    <div className="mt-[2vh] flex flex-row gap-3">
                        <span>
                            Don't have an account?
                        </span>
                        <Link to="/signup" className="text-[#FFB302]">
                            <span>
                                Sign up
                            </span>
                        </Link>
                    </div>
                </div>
            </form>
        </header>
    );
};

export default Login;
