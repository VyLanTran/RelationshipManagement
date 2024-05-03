import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLogin } from '../store/authReducer'
import BASE_URL from '@/../../constants.js'

export const useLogin = () => {
    const [error, setError] = useState(null) // at the beginning, there is no error
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // indicate the body of request is json
            body: JSON.stringify({
                email,
                password,
            }), // convert json-formatted data into a string and parse it to extract required field
        })

        const json = await res.json()

        if (!res.ok) {
            setIsLoading(false) // stop loading
            setError(json.error)
            throw new Error(json.error)
        } else {
            dispatch(
                setLogin({
                    user: json.user,
                    token: json.token,
                })
            )

            setIsLoading(false)
        }
    }

    const loginOrSignupWithGoogle = async (name, email, profilePicture) => {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`${BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // indicate the body of request is json
            body: JSON.stringify({
                name,
                email,
                username: name,
                password: 'password',
                profilePicture,
            }), // convert json-formatted data into a string and parse it to extract required field
        })

        const json = await res.json()

        if (!res.ok) {
            setIsLoading(false) // stop loading
            setError(json.error)
            throw new Error(json.error)
        } else {
            dispatch(
                setLogin({
                    user: json.user,
                    token: json.token,
                })
            )

            setIsLoading(false)
        }
    }

    return { login, loginOrSignupWithGoogle, isLoading, error }
}
