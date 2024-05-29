import React from 'react'
import PostPlaceholder from '../components/posts/PostPlaceholder.jsx'

const Posts = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <PostPlaceholder />
                <PostPlaceholder />
                <PostPlaceholder />
                <PostPlaceholder />
            </div>
        </>
    )
}

export default Posts
