import React from 'react'
import { useToast } from '../components/ui/use-toast'
import { Button } from '../components/ui/button'
import { Toaster } from '../components/ui/toaster'

// TODO: edit username, password here
const Settings = ({ type = 'CHAT3' }) => {
    if (type === 'OTHER') {
        return <div>OTHER</div>
    } else if (type === 'CHAT') {
        return <div>CHAT</div>
    } else {
        return <div>EVENTS</div>
    }
    // return <div>{type}</div>
}

export default Settings
