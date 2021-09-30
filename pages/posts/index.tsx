import type { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import superjson from 'superjson'
import { Post } from '.prisma/client';

interface PostsProps {
    posts: Post[];
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    
    const posts = await prisma.post.findMany({
        where: {published: true},
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

const Posts: NextPage<PostsProps> = ({posts}) => {
    return (
        <Layout title="Posts">
            {posts.map((post) => (
                <Link href={`/posts/${post.id}`} key={post.id}>
                    {post.title}
                </Link>
            ))}
            <Link href="/">Back</Link>
        </Layout>
    )
}

export default Posts;