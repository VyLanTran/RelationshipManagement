import { useDispatch } from 'react-redux'
import { setLogout } from '../state/authReducer'
import { clearPersistedState, resetAllSlices } from '../state/store.js'

export const useLogout = () => {
    const dispatch = useDispatch()

    const logout = () => {
        // dispatch(setLogout())
        resetAllSlices()
        clearPersistedState()
    }

    return { logout }
}
