import type { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import { PrismaClient } from '.prisma/client';
import { GetServerSideProps } from 'next';

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async () => {
    const posts = await prisma.post.findMany();
    return {
        props: {
            posts
        }
    }
}

const Posts: NextPage = ({posts}: any) => {
    return (
        <Layout title="Posts">
            {posts.map((post:any) => (
                <p key={post.id}>{post.name}</p>
            ))}
            <Link href="/">Back</Link>
        </Layout>
    )
}

export default Posts;