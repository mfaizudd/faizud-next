import { Post } from ".prisma/client";
import Layout from "components/Layout";
import { NextPage, GetServerSideProps } from "next";
import prisma from 'lib/prisma'

interface PostProps {
    post: Post
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const post = await prisma.post.findUnique({
        where: {
            id: Number(params?.id) || -1
        },
        include: {
            author: {
                select: { name: true }
            }
        }
    });

    return {
        props: {
            post
        }
    };
}

const Show: NextPage<PostProps> = (props) => {
    return (
        <Layout>
            {props.post.title}
            <br />
            {props.post.content}
        </Layout>
    )
}

export default Show;