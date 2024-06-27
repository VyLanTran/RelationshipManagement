import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import BASE_URL from '@/../../constants.js'
import { MdAttachFile } from 'react-icons/md'
import PostList from '../components/posts/PostList.jsx'

const Posts = () => {
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const [posts, setPosts] = useState([])
    const temp = useSelector((state) => state.post.items)
    const [friends, setFriends] = useState([])
    const [postText, setPostText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const placeholderAvatar =
        'https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif'
    const inputFileRef = useRef(null)
    
    useEffect(() => {

        const getFriends = async () => {
            try {
                // get friend list
                const res = await fetch(
                    `${BASE_URL}/users/${currentUser._id}/friends`,
                    {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                const friendsData = await res.json()
                if (res.ok) {
                    setFriends(friendsData)
                }
                
                const postData = []
                for (const friend of friendsData) {
                    if (friend.posts) {
                        for (const postId of friend.posts) {
                            postData.push({postId, user: friend})
                        }
                    }
                }

                if (currentUser.posts) {
                    currentUser.posts.forEach((postId) => {
                        postData.push({ postId, user: currentUser })
                    })
                }

                const fetchedPosts = await Promise.all(postData.map(async ({ postId, user }) => {
                    const postResponse = await fetch(`${BASE_URL}/posts/${postId}`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!postResponse.ok) {
                        console.error('Error fetching post:', postResponse.statusText);
                        return null; 
                    }
                    const post = await postResponse.json();
                    return { ...post, user }; 
                }));
                const finalPosts = fetchedPosts.filter(post => post != null);
                
                setPosts(finalPosts);
            } catch (error) {
                console.error('Error fetching friends:', error)
            }
        }
        getFriends()
    }, [currentUser._id, token])

    // create a post
    const handlePost = async () => {
        if (!postText && !selectedImage) {
            console.error('Add some text or image to post.')
            return
        }
        const postData = {
            authorId: currentUser._id,
            description: postText,
        }
        try {
            const response = await fetch(`${BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            })
            const res = await response.json()
            if (response.ok) {
                setPosts([...posts, res])
                setSelectedImage(null)
                setPostText('')
                console.log('Post created successfully:', res)
                // get user data
                const userResponse = await fetch(
                    `${BASE_URL}/users/${currentUser._id}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const userData = await userResponse.json()

                // Check if user data fetch was successful
                if (userResponse.ok) {
                    const currentPosts = userData.posts || []
                    const updatedPosts = [...currentPosts, res.post._id]

                    // update user's post array
                    const updateUserResponse = await fetch(
                        `${BASE_URL}/users`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ posts: updatedPosts }),
                        }
                    )

                    if (!updateUserResponse.ok) {
                        throw new Error('Failed to update user posts')
                    }
                } else {
                    throw new Error(res.error || 'Failed to create the post')
                }
            }
        } catch (error) {
            console.error('Error posting:', error)
        }
    }


    return (
            <div className="flex flex-col items-center justify-center pt-[1vh]">
                <PostList />
                <div className='fixed bottom-5 right-5'>
                    <button className='bg-yellow-400 w-16 h-16 text-white rounded-full text-3xl hover:bg-yellow-200'>
                        +
                    </button>
                </div>
            </div>
        
    )
}

export default Posts
