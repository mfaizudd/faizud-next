import type { GetServerSideProps, NextPage } from 'next'
import prisma from 'lib/prisma';
import { Category, Post, User } from '.prisma/client';
import PostsPage from 'components/Post/PostsPage';
import { getSession } from 'next-auth/client';
import Error from 'next/error';

type PostItem = Post & { author: User, category: Category }

interface PostsProps {
    posts: PostItem[];
    totalPost: number;
    loggedInUser: User;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const loggedInUser = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? "" }
    });

    const posts = await prisma.post.findMany({
        where: { published: false },
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
        where: { published: false }
    });
    return {
        props: {
            posts,
            totalPost,
            loggedInUser
        }
    }
}

const Drafts: NextPage<PostsProps> = (props) => {
    if (props.loggedInUser.role != "Admin") {
        return <Error statusCode={401} title="Unauthorized" />
    }

    return <PostsPage {...props} published={false} />
}

export default Drafts;