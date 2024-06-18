import { React, useState } from 'react'
import { FaHeart } from 'react-icons/fa'

const placeholderAvatar =
    'https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif'

const PostPlaceholder = ({ user, post }) => {
    const likes = post.likes || {}
    const likeCount = Object.values(likes).filter((value) => value).length

    return (
        <div className="w-[70vh] mt-[2vh] rounded-[20px]  flex flex-col h-auto overflow-y-auto ">
            <div className="author flex flex-row ml-0">
                {user.profilePicture ? (
                    <img
                        src={user.profilePicture.url}
                        alt="avatar"
                        className="avatar w-[5vh] h-[5vh] m-2 rounded-[20px] border-none"
                    />
                ) : (
                    <img
                        src={placeholderAvatar}
                        alt="avatar"
                        className="avatar w-[5vh] h-[5vh] m-2 rounded-[20px] border-none"
                    />
                )}
                <div className="user font-bold mt-[2vh]"> {user.username} </div>
            </div>
            <div className="imageContainer">
                <img src={post.picture} className="w-full rounded-[7px]" />
            </div>
            <div className="text-left text-base m-[1vh]">
                <p>{post.description}</p>
            </div>
            <div className="ml-[1vh] mt-[1vh] flex flex-row">
                <FaHeart size={20} />
                <p className="ml-2 text-base">{likeCount}</p>
            </div>
            <hr className="border-t-2 border-grey my-4"></hr>
        </div>
    )
}

export default PostPlaceholder
