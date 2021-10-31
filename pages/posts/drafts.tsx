import type { GetServerSideProps, NextPage } from 'next'
import prisma from 'lib/prisma';
import { Category, Post, User } from '.prisma/client';
import PostsPage from 'components/PostsPage';

type PostItem = Post & { author: User, category: Category }

interface PostsProps {
    posts: PostItem[];
    totalPost: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

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
            totalPost
        }
    }
}

const Drafts: NextPage<PostsProps> = (props) => {
    return <PostsPage {...props} published={false} />
}

export default Drafts;