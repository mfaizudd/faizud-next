import React, { useState } from "react";
import Layout from "components/Layout";
import Form from "components/Form";
import InputText from "components/InputText";
import Router from "next/router";
import Submit from "components/Submit";

const Draft: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
    }

    return (
        <Layout>
            <Form onSubmit={onSubmit} method="post">
                <InputText value={title} onChange={e=>setTitle(e.target.value)} name="title"/>
                <InputText value={content} onChange={e=>setContent(e.target.value)} name="content"/>
                <div className="px-3 my-3">
                    <Submit label="Create"/>
                </div>
            </Form>
        </Layout>
    );
}

export default Draft;