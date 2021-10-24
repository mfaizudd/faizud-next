import { Post, User } from ".prisma/client";
import Card from "./Card"
import { useSession } from "next-auth/client"
import { Session } from "next-auth";

interface PostCardProps {
    post: Post & { author: User }
    session?: Session | null;
}

const PostCard: React.FC<PostCardProps> = ({ post, session }) => {
    const loggedIn = Boolean(session);
    const unpublished = post.published === false;
    const owned = session?.user?.email === post.author.email;
    console.log(session);
    console.log(loggedIn);
    console.log(owned);
    return (
        <Card
            image={post?.featuredImage}
            category="Blog Post"
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
                        {!unpublished && (
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