import { Post } from ".prisma/client";
import Card from "../Card"
import Link from "next/link";
import { PostItem } from "types/PostItem";
import { Session } from "next-auth";

interface PostCardProps {
    post: PostItem;
    session: Session | null;
    onPublish?: (post: Post) => void;
    onDelete?: (post: Post) => void;
}

const ArtworkCard: React.FC<PostCardProps> = ({ post, session, onPublish, onDelete }) => {
    const loggedIn = Boolean(session);
    const unpublished = post.published === false;
    const owned = session?.user?.email === post?.author?.email;
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
            {session && loggedIn && owned && (
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