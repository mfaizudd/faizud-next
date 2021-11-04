import { Post } from ".prisma/client";
import { useSession } from "next-auth/client";
import React from "react";
import { PostItem } from "types/PostItem";
import PostCard from "./PostCard";

interface PostListProps {
    posts: PostItem[];
    onPublish?: (post: Post) => void;
    onDelete?: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPublish, onDelete }) => {
    const [session] = useSession();
    return (
        <>
            {
                posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        post={post}
                        session={session}
                        onPublish={onPublish}
                        onDelete={onDelete} />
                ))
            }
        </>
    )
}
export default PostList;