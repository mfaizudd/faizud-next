import type { GetServerSideProps, NextPage } from 'next'
import Layout from 'components/Layout';
import { Post, User } from '@prisma/client';
import prisma from 'lib/prisma';
import PostList from 'components/Post/PostList';
import { getSession } from 'next-auth/client';
import ArtworkList from 'components/Artwork/ArtworkList';
import Image from 'next/image';
import { url } from 'inspector';

type PostWithAuthor = Post & { author: User }
interface PostsProps {
    posts: PostWithAuthor[];
    artworks: PostWithAuthor[];
    loggedInUser: User;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    // Hardcode the category selection for now
    const posts = await prisma.post.findMany({
        where: {
            published: true,
            category: {
                isNot: {
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
        orderBy: {
            createdAt: "desc"
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
        orderBy: {
            createdAt: "desc"
        },
        take: 4
    });

    const session = await getSession(context);
    const loggedInUser = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? "" }
    });
    return {
        props: {
            posts,
            artworks,
            user: loggedInUser
        }
    }
}


const Home: NextPage<PostsProps> = ({ posts, artworks, loggedInUser }) => {
    return (
        <Layout title="Index">
            <div className="flex flex-col justify-center items-center h-24 w-full">
                <h1 className="text-4xl text-center">
                    Faizud.Net
                </h1>

                <p className="text-center">
                    {"Muhammad Faizud Daroin's personal website"}
                </p>
            </div>
            <div className="flex lg:flex-row m-5 flex-col items-center gap-4">
                <div className="w-full lg:w-7/12 md:mx-auto flex flex-col md:flex-row gap-2 justify-evenly flex-wrap">
                    <ArtworkList posts={artworks} loggedInUser={loggedInUser} />
                </div>
                <div className="w-full lg:w-5/12 md:mx-auto flex flex-col gap-2 justify-evenly">
                    <PostList posts={posts} loggedInUser={loggedInUser} />
                </div>
            </div>
        </Layout>
    )
}

export default Home
