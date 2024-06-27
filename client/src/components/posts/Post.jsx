import React from "react";

export const Post = ({post}) => {

    return (
        <div>
            <div>
                <h3>{post.memberIds}</h3>
            </div>
            <div>
                <p>{post.description}</p>
            </div>
        </div>
    )

}