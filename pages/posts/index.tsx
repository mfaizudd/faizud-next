import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import Card from 'components/Card';
import { Category, Post, User } from '.prisma/client';
import { getSession, useSession } from 'next-auth/client';
import PostList from 'components/PostList';
import { useState } from 'react';
import FloatingButton from 'components/FloatingButton';
import { FilePlus } from 'react-feather';
import { Session } from 'next-auth';
import Confirm, { ConfirmType } from 'components/Confirm';
import Router from 'next/router';
import axios, { AxiosError } from 'axios';

type PostItem = Post & { author: User, category: Category }

interface PostsProps {
    posts: PostItem[];
    totalPost: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const posts = await prisma.post.findMany({
        where: { published: true },
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true
        },
        orderBy: { createdAt: "desc" },
        take: 3
    });
    const totalPost = await prisma.post.count({
        where: { published: true }
    });
    return {
        props: {
            posts,
            totalPost
        }
    }
}

const Posts: NextPage<PostsProps> = (props) => {
    const [session, loading] = useSession();
    let loadingElement = null;
    let createElement = null;
    if (loading) {
        loadingElement = (
            <div className="mx-auto">
                Loading...
            </div>
        )
    }
    if (session) {
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

    const [posts, setPosts] = useState(props.posts)

    // selected post to delete/publish
    const [post, setPost] = useState<Post | null>(null)
    const [loadingPost, setLoadingPost] = useState(false);
    const [hasMore, setHasMore] = useState(posts.length < props.totalPost);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);
    const [isConfirmPublish, setIsConfirmPublish] = useState(false);

    const onPublish = (post: Post) => {
        setIsConfirmPublish(true);
        setPost(post);
    }

    const onDelete = (post: Post) => {
        setIsConfirmDelete(true);
        setPost(post);
    }

    const deletePost = async (id?: number) => {
        if (!id) return;

        await fetch(`/api/posts/${id}/delete`, {
            method: 'DELETE',
        });
        await Router.push('/posts');
    }

    const publish = async (id?: number) => {
        console.log(id);
        console.log(!id);
        if (!id) return;
        console.log('Published');

        await fetch(`/api/posts/${id}/publish`, {
            method: 'PUT',
        });
        await Router.push('/posts');
    }

    const getMorePosts = async () => {
        setLoadingPost(true);
        try {
            const response = await axios.get(`/api/posts?take=3&skip=${posts.length}&published=true`, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                const data = response.data;
                setPosts([...posts, ...data.posts]);
                setHasMore(posts.length + data.posts.length < data.total);
            }
        } catch (error: any) {
            console.log(error.response.data.error);
        }
        setLoadingPost(false);
    }

    return (
        <Layout title="Posts">
            <div className="flex flex-col gap-2 m-4 justify-evenly flex-grow">
                {loadingElement}
                <PostList
                    posts={posts}
                    onDelete={onDelete}
                    onPublish={onPublish} />
                {loadingPost && loadingElement}
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
                title="Confirm delete"
                desc="Are you sure you want to delete this post?"
                confirmType={ConfirmType.Danger}
                isOpen={isConfirmDelete}
                onConfirm={() => deletePost(post?.id)}
                onCancel={() => setIsConfirmDelete(false)}
                onClose={() => setIsConfirmDelete(false)}
            />
            <Confirm
                title="Confirm publish"
                desc="Are you sure you want to publish this post?"
                confirmType={ConfirmType.Success}
                isOpen={isConfirmPublish}
                onConfirm={() => publish(post?.id)}
                onCancel={() => setIsConfirmPublish(false)}
                onClose={() => setIsConfirmPublish(false)}
            />
        </Layout>
    )
}

export default Posts;