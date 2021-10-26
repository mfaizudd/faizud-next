import { Category, Post, User } from ".prisma/client";
import { Session } from "next-auth";
import React from "react";
import { PostItem } from "types/PostItem";
import Card from "./Card";
import PostCard from "./PostCard";

interface PostListProps {
    posts: PostItem[];
    onPublish?: (post: Post) => void;
    onDelete?: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPublish, onDelete }) => {
    return (
        <>
            {
                posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        post={post}
                        onPublish={onPublish}
                        onDelete={onDelete} />
                ))
            }
        </>
    )
}
export default PostList;