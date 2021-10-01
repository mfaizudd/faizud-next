import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout';
import Card from 'components/Card';
import { Post } from '@prisma/client';
import prisma from 'lib/prisma';
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


const Home: NextPage<PostsProps> = ({posts}) => {
    const date = new Date().getFullYear().toString();
    return (
        <Layout title="Index">
            <h1 className="text-4xl mx-auto text-center">
                Faizud.Net
            </h1>

            <p className="text-center">
                {"Muhammad Faizud Daroin's personal website"}
            </p>
            <div className="flex flex-row">
                <div className="w-7/12">
                </div>
                <div className="w-5/12">
                    {posts.map(post => (
                        <Card
                            key={post.id}
                            image="https://u.cubeupload.com/mfaizudd/mh014byfaizuddde8rdx.jpg"
                            category="Some category"
                            title={post.title}
                            description={post.content ?? ""}
                            route="/posts"
                        />
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default Home
