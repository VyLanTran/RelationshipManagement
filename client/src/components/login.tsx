import React from "react";
import styles from "./login.module.css";

const Login: React.FC = () => {
    return (
        <header className="App-login">
            <form style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className={styles.mainBoxLI}>
                    <h3 style={{ fontSize: '8vh', marginBottom: '2vh' }}>Log in</h3>
                    <input className={styles.textStyles} placeholder="username" id="username" name="username" />
                    <input className={styles.textStyles} placeholder="password" id="password" name="password" />
                    <input className={styles.submit} type="submit" value="Connect" />
                    <p>Don't have an account? <br/>Sign up here!</p>
                </div>
            </form>
        </header>
    );
}

export default Login;
