import { Post } from ".prisma/client";
import React from "react";
import Card from "./Card";

interface PostListProps {
    posts: Post[]
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    return (
        <>
            {
                posts.map((post) => (
                    <Card
                        key={post.id}
                        image="https://u.cubeupload.com/mfaizudd/mh014byfaizuddde8rdx.jpg"
                        category="Blog Post"
                        title={post.title}
                        description={post.content ?? ""}
                        route={`/posts/${post.id}`}
                    />
                ))
            }
        </>
    )
}
export default PostList;