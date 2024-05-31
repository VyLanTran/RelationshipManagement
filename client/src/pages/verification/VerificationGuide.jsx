import logo from '../../components/navbar/logo.png'

const VerificationGuide = () => {
    // const resendLink = async () => {
    //     const res = await fetch(`${BASE_URL}/auth/${id}/resendEmail`, {
    //         method: 'POST',
    //     })

    //     console.log('res: ', res)

    //     if (res.ok) {
    //         navigate('/verificationGuide')
    //     } else {
    //         toast({
    //             variant: 'destructive',
    //             description:
    //                 'An error occurred when creating new verificastion link',
    //         })
    //     }
    // }
    return (
        <div className="flex items-center h-full flex-col">
            <img
                className="h-[120px] mt-[calc(10vh)] mb-[50px]"
                src={logo}
                alt="Logo"
            />
            <div className="text-[#6fab87] mb-10 bg-[#d3ebdc] p-4">
                <div className="text-[16px] mb-4">
                    Thank you for registering. You will receive an email
                    containing a link to confirm this registration
                    <br />
                    Please follow the instructions in the email in order to
                    activate your APP_NAME account.
                </div>
                <div className="text-[14px] ">
                    Didn't receive an email?
                    <span
                        className="font-bold ml-1 cursor-pointer"
                        onClick={() => console.log('click')}
                    >
                        Resend verification link
                    </span>
                </div>
            </div>
        </div>
    )
}

export default VerificationGuide
