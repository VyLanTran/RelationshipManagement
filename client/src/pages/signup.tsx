import React from "react";
import { SocialIcon } from 'react-social-icons'

const SignUp: React.FC = () => {
    return (
        <header className="App-login">
            <form style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className="bg-slate-50 h-[82vh] w-2/5 flex flex-col items-center gap-y-2.5 mt-[10vh] rounded-[30px]">
                    <h3 style={{ fontSize: '8vh', marginTop: '3vh' }}>Sign up</h3>
                    <input className="textStyles" placeholder="email" id="email" name="email" />
                    <input className="textStyles" placeholder="username" id="username" name="username" />
                    <input className="textStyles" placeholder="password" id="password" name="password" />
                    <input className="textStyles" placeholder="confirm password" id="passwordmatch" name="passwordmatch" />
                    <div className="w-3/5 flex justify-around mt-[1vh]">
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://mail.google.com" />
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://facebook.com" />
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://instagram.com" />
                    </div>
                    <input className="font-azeret bg-[#FFB302] w-[20vh] text-[large] font-bold border h-[7vh] mb-[-2vh] mt-[1vh] rounded-[5px] border-solid border-[rgb(84,84,84)] hover:cursor-pointer hover:text-[white] hover:bg-[rgb(59,59,59)]" type="submit" value="Sign up" />
                </div>
            </form>
        </header>
    );
}

export default SignUp;