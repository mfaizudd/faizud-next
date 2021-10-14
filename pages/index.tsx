import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout';
import Card from 'components/Card';
import { Post } from '@prisma/client';
import prisma from 'lib/prisma';
import PostList from 'components/PostList';
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
        take: 3
    });
    return {
        props: {
            posts
        }
    }
}


const Home: NextPage<PostsProps> = ({posts}) => {
    return (
        <Layout title="Index">
            <h1 className="text-4xl mx-auto text-center">
                Faizud.Net
            </h1>

            <p className="text-center">
                {"Muhammad Faizud Daroin's personal website"}
            </p>
            <div className="flex lg:flex-row m-5 flex-col items-center">
                <div className="w-full lg:w-7/12">
                </div>
                <div className="w-full lg:w-5/12 md:mx-auto flex flex-col gap-2">
                    <PostList posts={posts} />
                </div>
            </div>
        </Layout>
    )
}

export default Home
