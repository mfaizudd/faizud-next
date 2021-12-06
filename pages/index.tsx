import type { GetServerSideProps, NextPage } from 'next'
import Layout from 'components/Layout';
import { Post, User } from '@prisma/client';
import prisma from 'lib/prisma';
import PostList from 'components/Post/PostList';
import { getSession } from 'next-auth/client';
import ArtworkList from 'components/Artwork/ArtworkList';
import Confirm, { ConfirmType } from 'components/Confirm';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';

type PostWithAuthor = Post & { author: User }
interface PostsProps {
    posts: PostWithAuthor[];
    artworks: PostWithAuthor[];
    loggedInUser: User;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    // Hardcode the category selection for now
    const posts = await prisma.post.findMany({
        where: {
            published: true,
            category: {
                isNot: {
                    name: "Artwork"
                }
            }
        },
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 3
    });

    const artworks = await prisma.post.findMany({
        where: {
            published: true,
            category: {
                name: "Artwork"
            }
        },
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 4
    });

    const session = await getSession(context);
    const loggedInUser = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? "" }
    });
    return {
        props: {
            posts,
            artworks,
            loggedInUser
        }
    }
}


const Home: NextPage<PostsProps> = (props) => {
    const [isConfirm, setIsConfirm] = useState(false);
    const [post, setPost] = useState<Post>();
    const [posts, setPosts] = useState(props.posts);
    const [artworks, setArtworks] = useState(props.artworks);
    const deletePost = (post: Post) => {
        setPost(post);
        setIsConfirm(true);
    }
    const executeDelete = async () => {
        setIsConfirm(false);
        const toastId = toast.loading("Processing...", { theme: "dark" });
        try {
            const response = await axios.delete(`/api/posts/${post?.id}/delete`);
            if (response?.status === 200) {
                await refreshPosts();
                await refreshArtworks();
            }
            setPost(undefined);
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
            render: "Post deleted",
            type: "success",
            isLoading: false,
            autoClose: 5000
        });
    }
    const refreshPosts = async () => {
        try {
            const response = await axios.get(`/api/posts?take=3&skip=0&published=true`);
            if (response.status === 200) {
                const data = response.data;
                setPosts(data.posts);
            }
        } catch (error: any) {
            console.error(error.response.data);
        }
    }
    const refreshArtworks = async () => {
        try {
            const response = await axios.get(`/api/artworks?take=3&skip=0&published=true`);
            if (response.status === 200) {
                const data = response.data;
                setArtworks(data.artworks);
            }
        } catch (error: any) {
            console.error(error.response.data);
        }
    }
    return (
        <Layout title="Index">
            <div className="flex flex-col justify-center items-center h-24 w-full">
                <h1 className="text-4xl text-center">
                    Faizud.Net
                </h1>

                <p className="text-center">
                    {"Muhammad Faizud Daroin's personal website"}
                </p>
            </div>
            <div className="flex lg:flex-row m-5 flex-col items-center gap-4">
                <div className="w-full lg:w-7/12 md:mx-auto flex flex-col md:flex-row gap-2 justify-evenly flex-wrap">
                    <ArtworkList 
                        posts={artworks} 
                        loggedInUser={props.loggedInUser}
                        onDelete={artwork => deletePost(artwork)} />
                </div>
                <div className="w-full lg:w-5/12 md:mx-auto flex flex-col gap-2 justify-evenly">
                    <PostList
                        posts={posts}
                        loggedInUser={props.loggedInUser}
                        onDelete={post => deletePost(post)} />
                </div>
            </div>
            <Confirm
                title="Are you sure?"
                desc="Are you sure you want to delete this post?"
                confirmType={ConfirmType.Danger}
                isOpen={isConfirm}
                onConfirm={() => executeDelete()}
                onCancel={() => setIsConfirm(false)}
                onClose={() => setIsConfirm(false)}
            />
        </Layout>
    )
}

export default Home
