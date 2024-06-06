import { toast } from '../../../src/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from '../../components/navbar/logo.png'

const VerificationResult = () => {
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const [isSuccessful, setIsSuccessful] = useState(false)
    const { id, token } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/auth/${id}/verify/${token}`,
                    {
                        method: 'GET',
                    }
                )
                if (res.ok) {
                    setIsSuccessful(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
        verifyAccount()
    }, [])

    const resendLink = async () => {
        const res = await fetch(`${BASE_URL}/auth/${id}/resendEmail`, {
            method: 'POST',
        })

        if (res.ok) {
            navigate('/verificationGuide')
        } else {
            toast({
                variant: 'destructive',
                description:
                    'An error occurred when creating new a verification link',
            })
        }
    }

    return (
        <div className="flex items-center h-full flex-col">
            <img
                className="h-[120px] mt-[calc(10vh)] mb-[50px]"
                src={logo}
                alt="Logo"
            />

            {isSuccessful ? (
                <div className="text-[#6fab87] mb-10 bg-[#d3ebdc] p-4">
                    <div className="text-[16px]">
                        Your APP_NAME was successfully activated. You may now
                        <Link to="/login">
                            <span
                                className="font-bold ml-2 cursor-pointer"
                                onClick={() => console.log('click')}
                            >
                                Log in
                            </span>
                        </Link>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="text-[29px] text-gray-600 mb-4">
                        Email verification link expired
                    </div>
                    <div className="text-[16px] text-gray-500 mb-10">
                        Looks like the verification link has expired. Don't
                        worry, we can send the link again to your email
                    </div>
                    <button
                        className="font-azeret bg-[#FFB302] hover:bg-[#ffc235] w-[200px] text-[12px] font-bold  h-[5vh] shadow-sm mt-4  hover:cursor-pointer"
                        onClick={resendLink}
                    >
                        Resend verification link
                    </button>
                </div>
            )}
        </div>
    )
}

export default VerificationResult
