import React from 'react'
import { useRef } from 'react'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
    const navigate = useNavigate()

    return (
        <div>
            <div className="homepage mx-[15vh] my-[5vh] p-[10vh] pr-[0] rounded-[10px] text-left overflow-hidden items-center">
                <p className="text-6xl font-bold">Forging Connections,</p>
                <p className="text-6xl font-bold">Preserving Memories</p>
                <p className="text-xl my-[2vh] w-[80vh]">
                    Explore a digital landscape where bonds are nurtured and
                    cherished moments live forever with Bondscape.
                </p>
                <Button
                    size="lg"
                    className="my-[1vh] mr-[1vh] bg-[#FFB302] text-[14px] font-bold"
                    onClick={() => navigate('/login')}
                >
                    Log in
                </Button>
                <Button
                    size="lg"
                    className="m-[1vh] text-xl bg-white hover:bg-[#f2f1ea] text-[#b37502] text-[14px]  border border-gray-300 font-bold"
                    onClick={() => navigate('/signup')}
                >
                    Sign up
                </Button>
            </div>
            <div className="landing-group mx-[15vh] mb-[5vh] bg-[#FFF] p-[10vh] rounded-[10px] text-right flex flex-row justify-end overflow-hidden">
                <div>
                    <p className="text-4xl font-bold">Group Archive</p>
                    <p className="text-xl my-[2vh] w-[80vh]">
                        Connect with your closest friends and family in private
                        groups. Share memories, inside jokes, and fun facts
                        about each other and save it into a convenient. Your
                        group is a cozy space to reminisce and strengthen your
                        bond.
                    </p>
                </div>
            </div>
            <div className="landing-diary mx-[15vh] mb-[5vh] bg-[#FFF] p-[10vh] rounded-[10px] text-left flex flex-row overflow-hidden">
                <div>
                    <p className="text-4xl font-bold">Diary Entries</p>
                    <p className="text-xl my-[2vh] w-[80vh]">
                        Journal your thoughts and experiences through
                        collaborative diaries. Add entries solo or let friends
                        contribute to create a living memoir. Cherish life's
                        moments together in one evolving story.
                    </p>
                </div>
            </div>
            <div className="landing-map mx-[15vh] mb-[5vh] bg-[#FFF] p-[10vh] rounded-[10px] text-right flex flex-row justify-end overflow-hidden">
                <div>
                    <p className="text-4xl font-bold">Live Maps</p>
                    <p className="text-xl my-[2vh] w-[80vh]">
                        Never lose touch - see at a glance where your loved ones
                        are on a live map. Keep tabs on friends' whereabouts and
                        meetup for adventures whenever you're in the area.
                    </p>
                </div>
            </div>
            <div className="landing-chat mx-[15vh] mb-[5vh] bg-[#FFF] p-[10vh] rounded-[10px] text-left flex flex-row overflow-hidden">
                <div>
                    <p className="text-4xl font-bold">Chat Rooms</p>
                    <p className="text-xl my-[2vh] w-[80vh]">
                        Message your inner circle in an ad-free,
                        distraction-free group chat. Send memories in form of
                        texts, photos, and videos in individual or group
                        conversations for seamless communication.
                    </p>
                </div>
            </div>
            <div className="landing-event mx-[15vh] mb-[5vh] bg-[#FFF] p-[10vh] rounded-[10px] text-right flex flex-row justify-end overflow-hidden">
                <div>
                    <p className="text-4xl font-bold">Events Planner</p>
                    <p className="text-xl my-[2vh] w-[80vh]">
                        Creating new experiences and memories by coordinating
                        plans and gatherings with shareable calendars. Create
                        solo or group events, then sync them to your main
                        calendar to never miss a meetup or special occasion.
                    </p>
                </div>
            </div>
            <div className="landing-connection mx-[15vh] mb-[5vh] bg-[#FFF] p-[10vh] rounded-[10px] text-left flex flex-row overflow-hidden">
                <div>
                    <p className="text-4xl font-bold">Connection Rolodex</p>
                    <p className="text-xl my-[2vh] w-[80vh]">
                        Build a rich people archive filled with profiles of your
                        nearest and dearest, even those not using the app.
                        Commemorate fun facts, nicknames, and precious memories.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Landing
