import { Post, User } from ".prisma/client";
import { useSession } from "next-auth/client";
import React from "react";
import { PostItem } from "types/PostItem";
import ArtworkCard from "./ArtworkCard";

interface PostListProps {
    posts: PostItem[];
    onPublish?: (post: Post) => void;
    onDelete?: (post: Post) => void;
    loggedInUser?: User;
}

const ArtworkList: React.FC<PostListProps> = ({ posts, onPublish, onDelete, loggedInUser }) => {
    return (
        <>
            {
                posts.map((post) => (
                    <ArtworkCard 
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
export default ArtworkList;