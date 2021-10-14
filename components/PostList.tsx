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
                        image={post?.featuredImage}
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