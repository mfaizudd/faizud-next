import type { GetServerSideProps, NextPage } from 'next'
import prisma from 'lib/prisma';
import { Category, Post, User } from '.prisma/client';
import PostsPage from 'components/Post/PostsPage';
import { getSession } from 'next-auth/client';

type PostItem = Post & { author: User, category: Category }

interface PostsProps {
    posts: PostItem[];
    totalPost: number;
    loggedInUser: User;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const posts = await prisma.post.findMany({
        where: { published: true },
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

const PostsIndex: NextPage<PostsProps> = (props) => {
    return <PostsPage {...props} published={true} />
}

export default PostsIndex;