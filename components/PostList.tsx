import { Post, User } from ".prisma/client";
import { Session } from "next-auth";
import React from "react";
import Card from "./Card";
import PostCard from "./PostCard";

type PostWithAuthor = Post & { author: User }

interface PostListProps {
    posts: PostWithAuthor[],
    session?: Session | null
}

const PostList: React.FC<PostListProps> = ({ posts, session }) => {
    return (
        <>
            {
                posts.map((post) => (
                    <PostCard key={post.id} post={post} session={session}/>
                ))
            }
        </>
    )
}
export default PostList;