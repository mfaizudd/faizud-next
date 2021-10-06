import React, { useState } from "react";
import Layout from "components/Layout";
import Form from "components/Form";
import InputText from "components/InputText";
import Router from "next/router";
import Submit from "components/Submit";
import TextArea from "components/TextArea";

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
            await Router.push('/posts');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Layout>
            <Form onSubmit={onSubmit} method="post">
                <InputText value={title} onChange={e=>setTitle(e.target.value)} name="title"/>
                <TextArea value={content} onChange={e=>setContent(e.target.value)} name="content"/>
                <div className="px-3 my-3">
                    <Submit label="Create"/>
                </div>
            </Form>
        </Layout>
    );
}

export default Draft;