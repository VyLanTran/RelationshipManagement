import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import axios from 'axios'

const Login: React.FC = () => {
  // Show/hide Password
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });
      console.log(res)
    }
    catch (error) {
      console.log('Log in failed')
    }
  }

  return (
    <header className="App-login">
      <form
        className="w-full h-screen flex justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="bg-slate-50  w-2/5 flex flex-col items-center gap-3 rounded-[30px] justify-center py-10">
          <h3 style={{ fontSize: "8vh", marginTop: "2vh" }}>Log in</h3>
          <input
            className="textStyles outline-none"
            placeholder="Email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-[70%]">
            <input
              className="textStyles w-[100%] outline-none"
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
              className="absolute mt-[2.2vh] right-[3vh]"
            >
              <Icon icon={showPassword ? eye : eyeOff} />
            </button>
          </div>
          <input
            className="font-azeret bg-[#FFB302] w-[20vh] text-[large] font-bold border h-[7vh] mb-[-2vh] mt-[1vh] rounded-[5px] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]"
            type="submit"
            value="Connect"
          />
          <div className="mt-[2vh] flex flex-row gap-3">
            <span>
              Don't have an account?
            </span>
            <Link to="/SignUp" className="text-[#FFB302]">
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
