import { useDispatch } from 'react-redux'
import { setLogout } from '../store/authReducer'
import { clearPersistedState } from '../store/store'

export const useLogout = () => {
    const dispatch = useDispatch()

    const logout = () => {
        dispatch(setLogout())
        clearPersistedState()
    }

    return { logout }
}
