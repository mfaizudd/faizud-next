import { Post, User } from ".prisma/client";
import { useSession } from "next-auth/client";
import React from "react";
import { PostItem } from "types/PostItem";
import PostCard from "./PostCard";

interface PostListProps {
    posts: PostItem[];
    onPublish?: (post: Post) => void;
    onDelete?: (post: Post) => void;
    loggedInUser?: User;
}

const PostList: React.FC<PostListProps> = ({ posts, onPublish, onDelete, loggedInUser }) => {
    const [session] = useSession();
    return (
        <>
            {
                posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        post={post}
                        onPublish={onPublish}
                        onDelete={onDelete}
                        loggedInUser={loggedInUser} />
                ))
            }
        </>
    )
}
export default PostList;