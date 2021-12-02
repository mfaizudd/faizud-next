import { Post, User } from ".prisma/client";
import Card from "./Card"
import Link from "next/link";
import { PostItem } from "types/PostItem";
import { Session } from "next-auth";

interface ArtworkCardProps {
    post: PostItem;
    onPublish?: (post: Post) => void;
    onDelete?: (post: Post) => void;
    loggedInUser?: User;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ post, onPublish, onDelete, loggedInUser }) => {
    const loggedIn = Boolean(loggedInUser);
    const unpublished = post.published === false;
    const owned = loggedInUser?.email === post?.author?.email;
    const isAdmin = loggedInUser?.role === "Admin";
    const publish = (post: Post) => {
        if (onPublish)
            onPublish(post);
    }
    const deletePost = (post: Post) => {
        if (onDelete)
            onDelete(post);
    }

    return (
        <Card
            image={post?.featuredImage}
            category={post?.category?.name ?? "Uncategorized"}
            title={post.title}
            description={post.content ?? ""}
            route={`/posts/${post.slug}`}
        >
            {loggedIn && isAdmin && owned && (
                <div className="relative right-0">
                    <div className="absolute right-0 bottom-0 m-2 flex flex-column gap-2">
                        <Link href={`/posts/${post.slug}/edit`}>
                            <a>
                                <div className="rounded-lg bg-gray-800 text-white p-3">
                                    Edit
                                </div>
                            </a>
                        </Link>
                        {unpublished && (
                            <a href="#" onClick={() => publish(post)}>
                                <div className="rounded-lg bg-gray-800 text-white p-3">
                                    Publish
                                </div>
                            </a>
                        )}
                        <a href="#" onClick={() => deletePost(post)}>
                            <div className="rounded-lg bg-gray-800 text-white p-3">
                                Delete
                            </div>
                        </a>
                    </div>
                </div>
            )}
        </Card>
    )
}

export default ArtworkCard;