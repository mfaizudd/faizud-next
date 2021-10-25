import { Category, Post, User } from ".prisma/client";
import Card from "./Card"
import { useSession } from "next-auth/client"
import Link from "next/link";
import { PostItem } from "types/PostItem";
import Router from "next/router";

interface PostCardProps {
    post: PostItem
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [session] = useSession();
    const loggedIn = Boolean(session);
    const unpublished = post.published === false;
    const owned = session?.user?.email === post?.author?.email;

    const publishPost = async (id: number) => {
        await fetch(`/api/posts/${id}/publish`, {
            method: 'PUT',
        });
        await Router.push('/posts');
    }

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
                        <Link href={`/posts/${post.id}/edit`}>
                            <a>
                                <div className="rounded-lg bg-gray-800 text-white p-3">
                                    Edit
                                </div>
                            </a>
                        </Link>
                        {unpublished && (
                            <a href="#" onClick={() => publishPost(post.id)}>
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