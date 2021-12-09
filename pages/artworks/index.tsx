import type { GetServerSideProps, NextPage } from 'next'
import prisma from 'lib/prisma';
import { Category, Post, User } from '.prisma/client';
import { getSession } from 'next-auth/client';
import ArtworksPage from 'components/Artwork/ArtworksPage';

type ArtworkItem = Post & { author: User, category: Category }

interface ArtworkProps {
    posts: ArtworkItem[];
    totalPost: number;
    loggedInUser: User;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const posts = await prisma.post.findMany({
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
        orderBy: { createdAt: "desc" },
        take: 3
    });
    const totalPost = await prisma.post.count({
        where: { published: true }
    });
    const session = await getSession(context);
    const loggedInUser = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? "" }
    });
    return {
        props: {
            posts,
            totalPost,
            loggedInUser
        }
    }
}

const ArtworksIndex: NextPage<ArtworkProps> = (props) => {
    return <ArtworksPage {...props} published={true} />
}

export default ArtworksIndex;