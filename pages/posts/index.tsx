import type { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import Card from 'components/Card';
import { Post } from '.prisma/client';
import { useSession } from 'next-auth/client';
import PostList from 'components/PostList';
import { useState } from 'react';
import FloatingButton from 'components/FloatingButton';
import { FilePlus } from 'react-feather';

interface PostsProps {
    posts: Post[];
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const posts = await prisma.post.findMany({
        where: { published: true },
        include: {
            author: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: "desc" },
        take: 3
    });
    return {
        props: {
            posts
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
    const [loadingPost, setLoadingPost] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const getMorePosts = async () => {
        setLoadingPost(true);
        const response = await fetch(`/api/posts?take=3&skip=${posts.length}&published=true`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setPosts([...posts, ...data.posts]);
        setHasMore(posts.length+data.posts.length < data.total);
        setLoadingPost(false);
    }

    return (
        <Layout title="Posts">
            <div className="flex flex-col gap-2 my-4 justify-evenly flex-grow">
                {loadingElement}
                <PostList posts={posts} />
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
        </Layout>
    )
}

export default Posts;