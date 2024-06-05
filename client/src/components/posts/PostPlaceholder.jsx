import { React, useState } from "react";
import { FaHeart } from "react-icons/fa";

const placeholderAvatar = "/avaPlaceHolder.png";

const PostUnread = ({ user, post }) => {
    console.log("Testing change")
    console.log(user)
    console.log(post)

    const likes = post.likes || {};
    const likeCount = Object.values(likes).filter((value) => value).length;

    return (
        <div className="w-[80vh] h-[50vh] mt-[2vh] flex flex-col overflow-y-auto bg-slate-600">
        <div className="bg-zinc-700 w-[40%] h-[50vh] flex flex-col items-center justify-around">
            {user.profilePicture ? (
            <img
                src={user.profilePicture.url}
                alt="avatar"
                className="w-[15vh] h-[20vh] border-none"
            />
            ) : (
            <img
                src={placeholderAvatar}
                alt="avatar"
                className="w-[15vh] h-[20vh] border-none"
            />
            )}
            <div>
                <p>This is the name</p>
                <p>This is the date</p>
                <p>THis is the group</p>
            </div>
        </div>
        </div>
    );
};

export default PostUnread;
