import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, isAuthPage = false }) => {
    const user = useSelector((state) => state?.auth?.user ?? null)

    if (isAuthPage) return !user ? children : <Navigate to="/" />

    return user ? children : <Navigate to="/home" />
}

export default ProtectedRoute
