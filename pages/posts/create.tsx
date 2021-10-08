import React, { useState } from "react";
import Layout from "components/Layout";
import Form from "components/Form";
import InputText from "components/InputText";
import Router from "next/router";
import Submit from "components/Submit";
import TextArea from "components/TextArea";
import Link from 'next/link';
import Editor from "components/Editor";
// import dynamic from "next/dynamic";
// const Editor = dynamic(() => import('components/Editor'), {ssr: false});

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

    return (
        <Layout>
            <h1 className="mx-5 text-4xl font-bold">New Draft</h1>
            <Form onSubmit={onSubmit} method="post">
                <InputText value={title} onChange={e=>setTitle(e.target.value)} name="title"/>
                {(typeof window !== undefined) && (
                <Editor 
                    value={content} 
                    onChange={v=>setContent(v)} />
                )}
                <div className="px-3 my-3">
                    <Submit label="Create"/>
                    <Link href="/posts">
                        <a> or Cancel</a>
                    </Link>
                </div>
            </Form>
        </Layout>
    );
}

export default Draft;