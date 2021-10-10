import { Post } from '.prisma/client';
import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import prisma from 'lib/prisma'
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from 'components/CodeBlock';
import { useSession } from 'next-auth/client';
import { Heading1, Heading2, Heading3 } from 'components/Headings';

interface PostProps {
    post: Post & { author: { name: string | null} }
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

const Show: React.FC<PostProps> = (props) => {
    const publishPost = async (id: number) => {
        await fetch(`/api/posts/${id}/publish`, {
            method: 'PUT',
        });
        await Router.push('/posts');
    }
    return (
        <Layout>
            <div className="max-w-3xl mx-auto my-4 lg:w-3/4">
                <h1 className="ml-3 text-4xl">{props.post.title}</h1>
                <sub className="text-gray-600 w-full inline-block text-right">By {props.post.author.name}</sub>
                <hr/>
                <br/>
                <ReactMarkdown className="space-y-5 text-justify" plugins={[rehypeHighlight]} components={{
                    code: CodeBlock,
                    h1: Heading1,
                    h2: Heading2,
                    h3: Heading3
                }}>
                    {props.post.content ?? ""}
                </ReactMarkdown>
            </div>
        </Layout>
    )
}

export default Show;