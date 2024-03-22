import React from "react";
import styles from "./login.module.css";
import { SocialIcon } from 'react-social-icons'

const Signup: React.FC = () => {
    return (
        <header className="App-login">
            <form style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className={styles.mainBoxSU}>
                    <h3 style={{ fontSize: '8vh', marginBottom: '2vh', marginTop: '3vh' }}>Sign up</h3>
                    <input className={styles.textStyles} placeholder="email" id="email" name="email" />
                    <input className={styles.textStyles} placeholder="username" id="username" name="username" />
                    <input className={styles.textStyles} placeholder="password" id="password" name="password" />
                    <input className={styles.textStyles} placeholder="confirm password" id="passwordmatch" name="passwordmatch" />
                    <div className={styles.continuewith}>
                        <SocialIcon className={styles.socialicon} fgColor="currentColor" url="https://mail.google.com" />
                        <SocialIcon className={styles.socialicon} fgColor="currentColor" url="https://facebook.com" />
                        <SocialIcon className={styles.socialicon} fgColor="currentColor" url="https://instagram.com" />
                    </div>
                    <input className={styles.submit} type="submit" value="Sign up" />
                </div>
            </form>
        </header>
    );
}

export default Signup;