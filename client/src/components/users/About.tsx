import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const About = ({ userId }) => {
    // this user is myself, who is authenticated to use this app
    const currentUser = useAuthContext().user


    // this is the user that owns this profile page
    const [user, setUser] = useState<{
        currentCity: string,
        hometown: string,
        company: string,
        school: string,
        phone: string,
        email: string
    } | null>(null);

    // fetch the data of this profile from the database once when we load this page
    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${currentUser.token}` },
            })
            const data = await res.json()

            if (res.ok) {
                setUser(data)
            }
        }

        // only allow currentUser to read this profile if they are authenticated
        if (currentUser) {
            getUser()
        }
    }, [])

    return (
        <div>
            {
                !user ? <div>No User</div> :

                    <div className="grid grid-cols-1 md:grid-cols-2 text-[14px]">
                        {/* TODO: Set secret information */}
                        <div className="p-4 justify-start flex border">
                            Live in
                            <span>
                                {user.currentCity ? user.currentCity : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Came from
                            <span>
                                {user.hometown ? user.hometown : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Work at
                            <span>
                                {user.company ? user.company : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Study at
                            <span>
                                {user.school ? user.school : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Phone
                            <span>
                                {user.phone ? user.phone : ""}
                            </span>
                        </div>
                        <div className="p-4 justify-start flex border">
                            Email
                            <span className="font-bold ml-1">
                                {user.email ? user.email : ""}
                            </span>
                        </div>
                    </div>
            }
        </div>
    );
}

export default About;