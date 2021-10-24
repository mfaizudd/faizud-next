import { Category, Post, User } from ".prisma/client";
import { Session } from "next-auth";
import React from "react";
import { PostItem } from "types/PostItem";
import Card from "./Card";
import PostCard from "./PostCard";

interface PostListProps {
    posts: PostItem[],
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