import { Category, Post, User } from ".prisma/client";
import { Session } from "next-auth";
import React from "react";
import { PostItem } from "types/PostItem";
import Card from "./Card";
import PostCard from "./PostCard";

interface PostListProps {
    posts: PostItem[],
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    return (
        <>
            {
                posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            }
        </>
    )
}
export default PostList;