import Error from 'next/error';
import type { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import Card from 'components/Card';
import { Post } from '.prisma/client';
import { useSession } from 'next-auth/client';
import PostList from 'components/PostList';

interface DraftsProps {
    posts: Post[];
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    
    const posts = await prisma.post.findMany({
        where: {published: false},
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

const Drafts: NextPage<DraftsProps> = ({posts}) => {
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
    else {
        return (
            <Error statusCode={401} title="Unauthorized"/>
        )
    }
    return (
        <Layout title="Posts">
            <div className="flex flex-col gap-4 my-4 justify-evenly flex-grow-0">
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

export default Drafts;