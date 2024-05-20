import React from "react";
import Navbar from "../components/navbar/Navbar.jsx";
import PostPlaceholder from "../components/posts/PostPlaceholder.jsx";

const Posts = () => {

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center pt-[10vh]">
                <PostPlaceholder />
                <PostPlaceholder />
                <PostPlaceholder />
                <PostPlaceholder />
            </div>
        </>
    )
}

export default Posts;