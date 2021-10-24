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

type PostItem = Post & { author: User, category: Category }

interface PostsProps {
    posts: PostItem[];
    session?: Session | null
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
    const session = await getSession(context);
    return {
        props: {
            posts,
            session
        }
    }
}

const Posts: NextPage<PostsProps> = (props) => {
    const session  = props.session;
    let loadingElement = null;
    let createElement = null;
    // if (loading) {
    //     loadingElement = (
    //         <div className="mx-auto">
    //             Loading...
    //         </div>
    //     )
    // }
    console.log(session);
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
            <div className="flex flex-col gap-2 m-4 justify-evenly flex-grow">
                {loadingElement}
                <PostList posts={posts} session={session} />
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