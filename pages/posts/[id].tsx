import { Post, User } from '.prisma/client';
import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import prisma from 'lib/prisma'
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from 'components/CodeBlock';
import Error from 'next/error';
import { useSession } from 'next-auth/client';
import { Check, Trash } from 'react-feather';
import { Heading1, Heading2, Heading3 } from 'components/Headings';
import FloatingButton from 'components/FloatingButton';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface PostProps {
    post: Post & { author: User }
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const post = await prisma.post.findUnique({
        where: {
            id: Number(params?.id) || -1
        },
        include: {
            author: true
        }
    });

    return {
        props: {
            post
        }
    };
}

const Show: React.FC<PostProps> = ({ post }) => {
    const [session, loading] = useSession();
    const [isConfirming, setIsConfirming] = useState(false);

    if (loading) {
        return <div>Authenticating...</div>;
    }
    if (post == null) {
        return <Error statusCode={404} />;
    }
    const loggedIn = Boolean(session);
    const unpublished = post.published === false;
    const owned = session?.user?.email === post.author.email;


    const publishPost = async (id: number) => {
        await fetch(`/api/posts/${id}/publish`, {
            method: 'PUT',
        });
        await Router.push('/posts');
    }

    // TODO: Add confirmation before deleting
    const deletePost = async (id: number) => {
        await fetch(`/api/posts/${id}/delete`, {
            method: 'DELETE',
        });
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
                <div className="fixed bottom-5 right-5 flex flex-row">
                    {loggedIn && unpublished && owned && (
                        <FloatingButton onClick={() => publishPost(post.id)} title="Publish">
                            <Check className="text-white" />
                        </FloatingButton>
                    )}
                    {loggedIn && owned && (
                        <FloatingButton onClick={() => setIsConfirming(true)} title="Delete">
                            <Trash className="text-white" />
                        </FloatingButton>
                    )}
                </div>
            </div>
            <Transition appear show={isConfirming} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => setIsConfirming(false)}
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-700 opacity-50 backdrop-filter backdrop-blur-3xl"/>
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Confirm Delete
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete this post?
                                    </p>
                                </div>

                                <div className="mt-4 gap-2 flex">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={() => deletePost(post.id)}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={() => setIsConfirming(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </Layout>
    )
}

export default Show;