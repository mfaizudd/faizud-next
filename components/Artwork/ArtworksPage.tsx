import { Post, User, Category } from ".prisma/client";
import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/client";
import React, { useState } from "react";
import Confirm, { ConfirmType } from "components/Confirm";
import Link from "next/link";
import FloatingButton from "components/FloatingButton";
import { FilePlus } from "react-feather"
import PostList from "components/Post/PostList";
import Layout from "components/Layout";
import { toast } from "react-toastify";

type ArtworkItem = Post & { author: User, category: Category }

interface ArtworksProps {
    posts: ArtworkItem[];
    totalPost: number;
    published: boolean;
    loggedInUser?: User;
}

const ArtworksPage: React.FC<ArtworksProps> = (props) => {
    let createElement = null;
    if (props.loggedInUser?.role == "Admin") {
        createElement = (
            <Link href="/posts/create" passHref>
                <div className="fixed right-5 bottom-5">
                    <FloatingButton title="Create">
                        <FilePlus className="text-white" />
                    </FloatingButton>
                </div>
            </Link>
        )
    }

    enum Operation {
        Publish,
        Delete,
        None
    }

    const [posts, setPosts] = useState(props.posts)

    const [hasMore, setHasMore] = useState(posts.length < props.totalPost);
    const [isConfirm, setIsConfirm] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmDesc, setConfirmDesc] = useState("");
    const [post, setPost] = useState<Post>();
    const [operation, setOperation] = useState(Operation.None);
    const [confirmType, setConfirmType] = useState(ConfirmType.Neutral);

    const doOperation = async (post?: Post, operation?: Operation) => {
        setIsConfirm(false);
        const toastId = toast.loading("Processing...", { theme: "dark" });
        try {
            let response: AxiosResponse | null = null;
            switch (operation) {
                case Operation.Publish:
                    response = await axios.put(`/api/artworks/${post?.id}/publish`);
                    if (response?.status === 200) {
                        await refreshPosts();
                    }
                    break;
                case Operation.Delete:
                    response = await axios.delete(`/api/artworks/${post?.id}/delete`);
                    if (response?.status === 200) {
                        await refreshPosts();
                    }
                    break;

                default:
                    break;
            }
            setPost(undefined);
            setOperation(Operation.None);
        } catch (error: any) {
            toast.update(toastId, {
                render: `${error.response.status}: ${error.response.data}`,
                type: "error",
                isLoading: false,
                autoClose: 5000,
                closeButton: true
            });
        }
        toast.update(toastId, {
            render: "Processing complete",
            type: "success",
            isLoading: false,
            autoClose: 5000
        })
    }

    const onPublish = (post: Post) => {
        if (operation != Operation.None) {
            toast("Operation in progress", { theme: "dark" });
            return;
        }
        showConfirm(
            "Publish post",
            "Are you sure you want to publish this post?",
            post,
            ConfirmType.Success,
            Operation.Publish
        );
    }

    const onDelete = (post: Post) => {
        if (operation != Operation.None) {
            toast("Operation in progress", { theme: "dark" });
            return;
        }
        showConfirm(
            "Delete artwork",
            "Are you sure you want to delete this artwork?",
            post,
            ConfirmType.Danger,
            Operation.Delete
        );
    }

    const showConfirm = (
        title: string,
        desc: string,
        post: Post,
        type: ConfirmType,
        operation: Operation) => {

        setConfirmTitle(title);
        setConfirmDesc(desc);
        setConfirmType(type);
        setPost(post);
        setOperation(operation);
        setIsConfirm(true);
    }

    const getMorePosts = async () => {
        const toastId = toast.loading("Loading artworks...", { theme: "dark" });
        try {
            const response = await axios.get(`/api/artworks?take=3&skip=${posts.length}&published=${props.published}`);
            if (response.status === 200) {
                const data = response.data;
                setPosts([...posts, ...data.posts]);
                setHasMore(posts.length + data.posts.length < data.total);
            }
        } catch (error: any) {
            toast.update(toastId, {
                render: `${error.response.status}: ${error.response.data}`,
                type: "error",
                isLoading: false,
                autoClose: 5000,
                closeButton: true
            });
        }
        toast.update(toastId, {
            render: "Posts loaded",
            type: "success",
            isLoading: false,
            autoClose: 1000
        });
    }

    const refreshPosts = async () => {
        const length = posts.length;
        try {
            const response = await axios.get(`/api/artworks?take=${posts.length}&skip=0&published=${props.published}`);
            if (response.status === 200) {
                const data = response.data;
                setPosts(data.posts);
                setHasMore(length < data.total);
            }
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    return (
        <Layout title="Posts">
            <div className="flex flex-col gap-2 mx-4 justify-evenly flex-grow">
                <PostList
                    posts={posts}
                    onDelete={onDelete}
                    onPublish={onPublish}
                    loggedInUser={props.loggedInUser} />
            </div>
            {createElement}
            {hasMore && (
                <div className="text-center text-white bg-blue-500 rounded-lg p-2 cursor-pointer m-2" onClick={getMorePosts}>
                    More Posts
                </div>
            )}
            <div className="text-center">
                <Link href="/">Back</Link>
            </div>
            <Confirm
                title={confirmTitle}
                desc={confirmDesc}
                confirmType={confirmType}
                isOpen={isConfirm}
                onConfirm={() => doOperation(post, operation)}
                onCancel={() => setIsConfirm(false)}
                onClose={() => setIsConfirm(false)}
            />
        </Layout>
    )
}

export default ArtworksPage;