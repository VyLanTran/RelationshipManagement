import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/navbar/Navbar.jsx'
import PostPlaceholder from '../components/posts/PostPlaceholder.jsx'
import BASE_URL from '@/../../constants.js'
import { MdAttachFile } from 'react-icons/md'

const Posts = () => {
    const currentUser = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token)
    const [posts, setPosts] = useState([])
    const [friends, setFriends] = useState([])
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null)
    const placeholderAvatar =
        'https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif'
    const inputFileRef = useRef(null)

    useEffect(() => {
        // get friend list
        const getFriends = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/users/${currentUser._id}/friends`,
                    {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                const data = await res.json()
                if (res.ok) {
                    setFriends(data)
                }

                console.log(friends)

                let postId = data.map((friend) => friend.posts)

                console.log(currentUser)
                if (currentUser.posts) {
                    postId = [...currentUser.posts, ...postId];
                }

                const postPromises = postId.map((id) =>
                    fetch(`${BASE_URL}/posts/${id}`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
                const postsResponses = await Promise.all(postPromises)
                const allPosts = await Promise.all(
                    postsResponses.map(async (response) => {
                        if (!response.ok) {
                            console.error(
                                `Error fetching posts for a friend: ${response.statusText}`
                            )
                            return []
                        }
                        return await response.json()
                    })
                )
                const flattenedPosts = allPosts.flatMap(
                    (postsArray) => postsArray
                )
                const finalPosts = flattenedPosts.map((post) => post.post)
                setPosts(finalPosts)
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
                description: postText
            }
            try {
                const response = await fetch(`${BASE_URL}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(postData)
                })
                const res = await response.json()
                if (response.ok) {
                    setPosts([...posts, res])
                    setSelectedImage(null)
                    setPostText('')
                    console.log('Post created successfully:', res)
                    // get user data
                    const userResponse = await fetch(`${BASE_URL}/users/${currentUser._id}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const userData = await userResponse.json();

    
                    // Check if user data fetch was successful
                    if (userResponse.ok) {
                        const currentPosts = userData.posts || [];
                        const updatedPosts = [...currentPosts, res.post._id];
                        
                        // update user's post array 
                        const updateUserResponse = await fetch(`${BASE_URL}/users`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ posts: updatedPosts })
                        });
    
                        if (!updateUserResponse.ok) {
                            throw new Error('Failed to update user posts');
                        }
                } else {
                    throw new Error(res.error || 'Failed to create the post');
                }
            } }catch (error) {
                console.error('Error posting:', error)
            }
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file)
        } else {
            console.error('Please select an image.')
        }
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center pt-[1vh]'>
                <div className='flex w-[70vh] m-4 h-auto'>
                    <div className='flex flex-row items-center w-full'>
                        {currentUser.profilePicture ? (
                            <img
                                src={currentUser.profilePicture.url}
                                alt='avatar'
                                className='w-[5vh] h-[5vh] m-2 rounded-[20px] border-none'
                            />
                        ) : (
                            <img
                                src={placeholderAvatar}
                                alt='avatar'
                                className='w-[5vh] h-[5vh] m-2 rounded-[20px] border-none'
                            />
                        )}
                        <textarea
                            name='create post'
                            className='flex-1 h-[5vh] border-none bg-transparent focus:outline-none resize-none mt-5'
                            placeholder='Post something!!'
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                        ></textarea>
                        <input
                            type='file'
                            accept='image/*'
                            style={{ display: 'none' }}
                            ref={inputFileRef}
                            onChange={handleFileUpload}
                        />
                        <div className=''>
                            {selectedImage && (
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt='Selected'
                                    className='w-auto h-auto max-w-[10vh] max-h-[10vh] ml-4 rounded-[20px]'
                                />
                            )}
                        </div>

                        <MdAttachFile
                            size={30}
                            className='cursor-pointer'
                            onClick={() => inputFileRef.current.click()}
                        />
                        <button
                            className='w-[10vh] h-[5vh] bg-[#FFB302] rounded-[3vh]'
                            onClick={handlePost}
                        >
                            Post
                        </button>
                    </div>
                </div>

                <hr className='border-t-2 border-grey-700 my-4 w-[70vh]' />

                {friends.length > 0 ? posts.map((post, index) => (
                    <PostPlaceholder
                        key={index}
                        user={friends[index % friends.length]}
                        post={post}
                    />
                )) : (
                    <p>No posts to display yet</p>
                )}
            </div>
        </>
    )
}

export default Posts
