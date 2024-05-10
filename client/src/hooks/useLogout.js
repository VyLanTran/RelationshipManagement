import { useDispatch } from 'react-redux'
import { setLogout } from '../store/authReducer'
import { clearPersistedState, resetAllSlices } from '../store/store.js'

export const useLogout = () => {
    const dispatch = useDispatch()

    const logout = () => {
        // dispatch(setLogout())
        resetAllSlices()
        clearPersistedState()
    }

    return { logout }
}
