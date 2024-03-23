import React from "react";
import styles from "./login.module.css";
import { SocialIcon } from 'react-social-icons'

const SignUp: React.FC = () => {
    return (
        <header className="App-login">
            <form style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className={styles.mainBoxSU}>
                    <h3 style={{ fontSize: '8vh', marginTop: '3vh' }}>Sign up</h3>
                    <input className="textStyles" placeholder="email" id="email" name="email" />
                    <input className="textStyles" placeholder="username" id="username" name="username" />
                    <input className="textStyles" placeholder="password" id="password" name="password" />
                    <input className="textStyles" placeholder="confirm password" id="passwordmatch" name="passwordmatch" />
                    <div className={styles.continuewith}>
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://mail.google.com" />
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://facebook.com" />
                        <SocialIcon className="text-[white] hover:text-[black]" fgColor="currentColor" url="https://instagram.com" />
                    </div>
                    <input className={styles.submit} type="submit" value="Sign up" />
                </div>
            </form>
        </header>
    );
}

export default SignUp;