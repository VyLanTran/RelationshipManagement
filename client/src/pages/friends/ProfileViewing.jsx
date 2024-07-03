import { useSelector } from 'react-redux'

import Autoplay from 'embla-carousel-autoplay'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../../components/ui/carousel'
import { useEffect, useRef, useState } from 'react'

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

const ProfileViewing = () => {
    const user = useSelector((state) => state.friend.profileViewing)

    return user ? (
        <div className="w-full h-full">
            <div className="bg-white border border-gray-300 m-6 rounded-md">
                <UserProfile user={user} />
            </div>
        </div>
    ) : (
        <div>Choose a profile to view</div>
    )
}

export default ProfileViewing

const UserProfile = ({ user }) => {
    return (
        <div className="w-full flex flex-col p-4 ">
            <Header user={user} />

            <div className="w-full py-6 ">
                <CarouselPlugin user={user} />
            </div>
        </div>
    )
}

const Header = ({ user }) => {
    return (
        <div className="w-full flex flex-row items-center pb-6 border-b border-gray-300">
            <div className="w-[60%] flex flex-row gap-4 items-center">
                <div className="">
                    <img
                        className="rounded-full w-[60px]"
                        src={user.profilePicture.url}
                        alt=""
                    />
                </div>
                <div className="">
                    <div className="text-[24px] font-bold">{user.name}</div>
                </div>
            </div>
            <div className="w-[40%] flex flex-row">
                <div className="w-[50%] flex justify-center flex-col">
                    <div className="text-[34px]">20</div>
                    <div className="text-[14px] text-gray-500">
                        mutual friends
                    </div>
                </div>
                <div className="w-[50%] flex justify-center flex-col">
                    <div className="text-[34px]">4</div>
                    <div className="text-[14px] text-gray-500">
                        shared groups
                    </div>
                </div>
            </div>
        </div>
    )
}

// TODO: click on "my bonds" also shows
const CarouselPlugin = ({ user }) => {
    const token = useSelector((state) => state.auth.token)
    const { currentCity, hometown, school, hobbies } = user
    const [introImages, setIntroImages] = useState([])

    const dict = {
        currentCityImage: `I live in ${currentCity}`,
        hometownImage: `I came from ${hometown}`,
        schoolImage: `I study at ${school}`,
    }

    const fetchIntroImages = async () => {
        try {
            const res = await fetch(`${BASE_URL}/users/introImages`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentCity,
                    hometown,
                    school,
                    hobbies,
                }),
            })

            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error)
            } else {
                const images = []

                if (json.currentCityImage) {
                    images.push({
                        type: 'currentCityImage',
                        text: dict.currentCityImage,
                        url: json.currentCityImage,
                    })
                }
                if (json.hometownImage) {
                    images.push({
                        type: 'hometownImage',
                        text: dict.hometownImage,
                        url: json.hometownImage,
                    })
                }
                if (json.schoolImage) {
                    images.push({
                        type: 'schoolImage',
                        text: dict.schoolImage,
                        url: json.schoolImage,
                    })
                }
                if (json.hobbyImages) {
                    json.hobbyImages.forEach((url, index) => {
                        if (url) {
                            images.push({
                                type: 'hobbyImage',
                                text: `I like ${hobbies[index]}`,
                                url,
                            })
                        }
                    })
                }

                setIntroImages(images)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        fetchIntroImages()
    }, [user])

    const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

    return (
        <Carousel plugins={[plugin.current]} className="w-full">
            <CarouselContent>
                {introImages.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1 flex flex-col items-center justify-center gap-2">
                            <div className="text-[14px] text-gray-500">
                                {image.text}
                            </div>
                            <img
                                className="w-full h-full object-cover"
                                style={{ width: '300px', height: '300px' }}
                                src={image.url}
                                alt={image.type}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
