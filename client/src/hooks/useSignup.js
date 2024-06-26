import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLogin } from '../state/authReducer'
import BASE_URL from '@/../../constants.js'

export const useSignup = () => {
    const [error, setError] = useState(null) // at the beginning, there is no error
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()

    const signup = async (name, email, username, password, confirmPassword) => {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // indicate the body of request is json
            body: JSON.stringify({
                name,
                email,
                username,
                password,
                confirmPassword,
            }), // convert json-formatted data into a string and parse it to extract required field
        })

        const json = await res.json()

        if (!res.ok) {
            setIsLoading(false) // stop loading
            setError(json.error)
            throw new Error(json.error)
        } else {
            // update auth context with current user
            // dispatch(
            //     setLogin({
            //         user: json.user,
            //         token: json.token,
            //     })
            // )
            setIsLoading(false)
            setMessage(res.message)
        }
    }

    return { signup, isLoading, error, message }
}
