import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout';
import Card from 'components/Card';
import { Post, User } from '@prisma/client';
import prisma from 'lib/prisma';
import PostList from 'components/Post/PostList';
import { getSession } from 'next-auth/client';
import { Session } from 'next-auth';

type PostWithAuthor = Post & { author: User }
interface PostsProps {
    posts: PostWithAuthor[];
    artworks: PostWithAuthor[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    // Hardcode the category selection for now
    const posts = await prisma.post.findMany({
        where: { 
            published: true,
            category: {
                NOT: {
                    name: "Artwork"
                }
            }
        },
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true
        },
        take: 3
    });

    const artworks = await prisma.post.findMany({
        where: { 
            published: true,
            category: {
                name: "Artwork"
            }
        },
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true
        },
        take: 3
    });

    const session = await getSession(context);
    return {
        props: {
            posts,
            artworks,
            session
        }
    }
}


const Home: NextPage<PostsProps> = ({ posts, artworks }) => {
    return (
        <Layout title="Index">
            <h1 className="text-4xl mx-auto text-center">
                Faizud.Net
            </h1>

            <p className="text-center">
                {"Muhammad Faizud Daroin's personal website"}
            </p>
            <div className="flex lg:flex-row m-5 flex-col items-center gap-4">
                <div className="w-full lg:w-7/12">
                    <PostList posts={artworks} />
                </div>
                <div className="w-full lg:w-5/12 md:mx-auto flex flex-col gap-2">
                    <PostList posts={posts} />
                </div>
            </div>
        </Layout>
    )
}

export default Home
