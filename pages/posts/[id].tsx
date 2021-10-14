import { Post, User } from '.prisma/client';
import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import prisma from 'lib/prisma'
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from 'components/CodeBlock';
import Error from 'next/error';
import { useSession } from 'next-auth/client';
import { Check } from 'react-feather';
import { Heading1, Heading2, Heading3 } from 'components/Headings';
import FloatingButton from 'components/FloatingButton';

interface PostProps {
    post: Post & { author: User }
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const post = await prisma.post.findUnique({
        where: {
            id: Number(params?.id) || -1
        },
        include: {
            author: true
        }
    });

    return {
        props: {
            post
        }
    };
}

const Show: React.FC<PostProps> = ({ post }) => {
    const [session, loading] = useSession();
    if (loading) {
        return <div>Authenticating...</div>;
    }
    if (post == null) {
        return <Error statusCode={404} />;
    }
    const loggedIn = Boolean(session);
    const unpublished = post.published === false;
    const owned = session?.user?.email === post.author.email;

    const publishPost = async (id: number) => {
        await fetch(`/api/posts/${id}/publish`, {
            method: 'PUT',
        });
        await Router.push('/posts');
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto my-4 lg:w-3/4">
                <h1 className="ml-3 text-4xl">{post.title}</h1>
                <sub className="text-gray-600 w-full inline-block text-right">By {post.author.name}</sub>
                <hr />
                <br />
                <ReactMarkdown className="space-y-5 text-justify" plugins={[rehypeHighlight]} components={{
                    code: CodeBlock,
                    h1: Heading1,
                    h2: Heading2,
                    h3: Heading3
                }}>
                    {post.content ?? ""}
                </ReactMarkdown>
                <div className="fixed bottom-5 right-5 flex flex-row">
                    {loggedIn && unpublished && owned && (
                        <FloatingButton onClick={_e => publishPost(post.id)} title="Publish">
                            <Check className="text-white" />
                        </FloatingButton>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Show;