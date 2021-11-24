import { Post } from ".prisma/client";
import { useSession } from "next-auth/client";
import React from "react";
import { PostItem } from "types/PostItem";
import ArtworkCard from "./ArtworkCard";

interface PostListProps {
    posts: PostItem[];
    onPublish?: (post: Post) => void;
    onDelete?: (post: Post) => void;
}

const ArtworkList: React.FC<PostListProps> = ({ posts, onPublish, onDelete }) => {
    const [session] = useSession();
    return (
        <>
            {
                posts.map((post) => (
                    <ArtworkCard 
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
export default ArtworkList;