import type { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import prisma from 'lib/prisma';
import { GetStaticProps } from 'next';
import Card from 'components/Card';
import { Post } from '.prisma/client';
import { useSession } from 'next-auth/client';

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
            <div className="flex flex-wrap gap-2 my-4 justify-evenly">
                {loadingElement}
                {createElement}
                {posts.map((post) => (
                    <Card
                        key={post.id}
                        image="https://u.cubeupload.com/mfaizudd/mh014byfaizuddde8rdx.jpg"
                        category="Blog Post"
                        title={post.title}
                        description={post.content ?? ""}
                        route="/posts"
                    />
                ))}
            </div>
            <div className="text-center">
                <Link href="/">Back</Link>
            </div>
        </Layout>
    )
}

export default Posts;