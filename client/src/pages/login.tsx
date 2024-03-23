import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

const Login: React.FC = () => {
  // Show/hide Password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <header className="App-login">
      <form
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <div className="bg-slate-50 h-[62vh] w-2/5 flex flex-col items-center gap-y-3 mt-[20vh] rounded-[30px] justify-start text-left">
          <h3 style={{ fontSize: "8vh", marginTop: "2vh" }}>Log in</h3>
          <input
            className="textStyles"
            placeholder="username"
            id="username"
            name="username"
          />
          <div className="relative w-[70%]">
            <input
              className="textStyles w-[100%]"
              type={showPassword ? "text" : "password"}
              placeholder="password"
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
          <p className="mt-[2vh]">
            Don't have an account? Sign up{" "}
            <Link to="/SignUp" className="text-[blue] underline">
              here
            </Link>
          </p>
        </div>
      </form>
    </header>
  );
};

export default Login;
