import type { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import Card from 'components/Card';
import { Post } from '.prisma/client';
import { useSession } from 'next-auth/client';
import PostList from 'components/PostList';

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
    });
    return {
        props: {
            posts
        }
    }
}

const Posts: NextPage<PostsProps> = ({ posts }) => {
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
            <Card
                title="Create"
                description="Create new post"
                route="/posts/create"
            />
        )
    }
    return (
        <Layout title="Posts">
            <div className="flex flex-col gap-2 my-4 justify-evenly flex-grow">
                {loadingElement}
                {createElement}
                <PostList posts={posts} />
            </div>
            <div className="text-center">
                <Link href="/">Back</Link>
            </div>
        </Layout>
    )
}

export default Posts;