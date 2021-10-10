import React, { useState } from "react";
import Layout from "components/Layout";
import Form from "components/Form";
import InputText from "components/InputText";
import Router from "next/router";
import Submit from "components/Submit";
import TextArea from "components/TextArea";
import Link from 'next/link';
import dynamic from "next/dynamic";
import rehypeHighlight from 'rehype-highlight';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from "react-markdown";
import CodeBlock from "components/CodeBlock";
import { Heading1, Heading2, Heading3 } from "components/Headings";

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

const Draft: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = { title, content }
            await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            await Router.push('/posts/drafts');
        } catch (error) {
            console.error(error);
        }
    }

    const render = (text: string) => {
        return (
            <ReactMarkdown plugins={[rehypeHighlight]} components={{
                code: CodeBlock,
                h1: Heading1,
                h2: Heading2,
                h3: Heading3
            }}>{text}</ReactMarkdown>
        )
    }

    return (
        <Layout>
            <h1 className="mx-5 text-4xl font-bold">New Draft</h1>
            <Form onSubmit={onSubmit} method="post">
                <InputText value={title} onChange={e => setTitle(e.target.value)} name="title" />
                <div className="px-3 my-3 w-full">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => render(text)}
                        value={content}
                        onChange={({text}) => setContent(text)}
                    />
                </div>
                <div className="px-3 my-3">
                    <Submit label="Create" />
                    <Link href="/posts">
                        <a> or Cancel</a>
                    </Link>
                </div>
            </Form>
        </Layout>
    );
}

export default Draft;