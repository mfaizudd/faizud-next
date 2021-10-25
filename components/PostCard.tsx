import { Category, Post, User } from ".prisma/client";
import Card from "./Card"
import { useSession } from "next-auth/client"
import { Session } from "next-auth";
import { PostItem } from "types/PostItem";

interface PostCardProps {
    post: PostItem
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [session] = useSession();
    const loggedIn = Boolean(session);
    const unpublished = post.published === false;
    const owned = session?.user?.email === post?.author?.email;
    return (
        <Card
            image={post?.featuredImage}
            category={post?.category?.name ?? "Uncategorized"}
            title={post.title}
            description={post.content ?? ""}
            route={`/posts/${post.id}`}
        >
            {session && loggedIn && owned && (
                <div className="relative right-0">
                    <div className="absolute right-0 bottom-0 m-2 flex flex-column gap-2">
                        <a href="#">
                            <div className="rounded-lg bg-gray-800 text-white p-3">
                                Edit
                            </div>
                        </a>
                        {unpublished && (
                            <a href="#">
                                <div className="rounded-lg bg-gray-800 text-white p-3">
                                    Publish
                                </div>
                            </a>
                        )}
                        <a href="#">
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

export default PostCard;