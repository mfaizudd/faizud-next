import { Post, User } from '.prisma/client';
import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import prisma from 'lib/prisma'
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from 'components/CodeBlock';
import Error from 'next/error';
import { getSession, useSession } from 'next-auth/client';
import { Check, Trash } from 'react-feather';
import { Heading1, Heading2, Heading3 } from 'components/Headings';
import FloatingButton from 'components/FloatingButton';
import { Fragment, useState } from 'react';
import Confirm, { ConfirmType } from 'components/Confirm';
import { toast } from 'react-toastify';
import axios from 'axios';

interface PostProps {
    post: Post & { author: User };
    loggedInUser: User;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const post = await prisma.post.findUnique({
        where: {
            slug: String(params?.slug)
        },
        include: {
            author: true
        }
    });

    const session = await getSession(params);
    const loggedInUser = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? "" }
    });

    return {
        props: {
            post,
            loggedInUser
        }
    };
}

const Show: React.FC<PostProps> = ({ post, loggedInUser }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    if (post == null) {
        return <Error statusCode={404} />;
    }
    const loggedIn = Boolean(loggedInUser);
    const unpublished = post.published === false;
    const owned = loggedInUser?.email === post.author.email;
    const isAdmin = loggedInUser?.role === "Admin";

    const publishPost = async (id: number) => {
        const toastId = toast.loading("Publishing...", { theme: "dark" })
        try {
            const response = await axios.put(`/api/posts/${id}/publish`);
            if (response.status === 200) {
                toast.update(toastId, {
                    render: "Update complete",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000
                });
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
        await Router.push('/posts');
    }

    const deletePost = async (id: number) => {
        const toastId = toast.loading("Deleting post...", { theme: "dark" });
        try {
            const response = await axios.delete(`/api/posts/${id}/delete`);
            if (response.status === 200) {
                toast.update(toastId, {
                    render: "Deleted",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000
                });
            }
        } catch (error: any) {
            toast.update(toastId, {
                render: `${error.response.status}: ${error.response.data}`,
                type: "error",
                isLoading: false,
                autoClose: 5000
            });
        }
        await Router.push('/posts');
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto my-4 lg:w-3/4">
                <h1 className="ml-3 text-4xl">{post.title}</h1>
                <sub className="text-gray-600 w-full inline-block text-right">By {post.author.name}</sub>
                <hr />
                <br />
                <ReactMarkdown className="space-y-5 text-justify" plugins={[rehypeHighlight]} components={{
                    code: CodeBlock,
                    h1: Heading1,
                    h2: Heading2,
                    h3: Heading3
                }}>
                    {post.content ?? ""}
                </ReactMarkdown>
                <div className="fixed bottom-5 right-5 flex flex-row gap-2">
                    {loggedIn && isAdmin && unpublished && owned && (
                        <FloatingButton onClick={() => publishPost(post.id)} title="Publish">
                            <Check className="text-white" />
                        </FloatingButton>
                    )}
                    {loggedIn && isAdmin && owned && (
                        <FloatingButton onClick={() => setIsConfirming(true)} title="Delete">
                            <Trash className="text-white" />
                        </FloatingButton>
                    )}
                </div>
            </div>
            <Confirm
                title="Confirm Delete"
                desc="Are you sure you want to delete"
                confirmType={ConfirmType.Danger}
                isOpen={isConfirming}
                onConfirm={() => deletePost(post.id)}
                onCancel={() => setIsConfirming(false)}
                onClose={() => setIsConfirming(false)}
            />
        </Layout>
    )
}

export default Show;