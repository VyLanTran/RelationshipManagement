import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchedPosts } from "../../state/postReducer"
import { Post } from "./Post"

const PostList = () => {

    const dispatch = useDispatch()
    const posts = useSelector((state) => state.post.items)
    const postStatus = useSelector((state) => state.post.status)
    const postError = useSelector((state) => state.post.error)

    useEffect(() => {
        if(postStatus === 'idle') {
            console.log('hello')
            dispatch(fetchedPosts())
        }
    }, [postStatus, dispatch])

    return (
        <div>
            {postStatus === 'loading' ? <h1>Loading...</h1> : null}
            {postError ? <h1>Error: {postError}</h1> : null}
            {posts.map(post => <Post post={post}/>)}
        </div>
    )
}

export default PostList