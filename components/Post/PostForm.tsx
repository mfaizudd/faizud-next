import { Category } from "@prisma/client";
import CodeBlock from "components/CodeBlock";
import ComboBox from "components/ComboBox";
import Form from "components/Form";
import { Heading1, Heading2, Heading3 } from "components/Headings";
import InputText from "components/InputText";
import Layout from "components/Layout";
import Submit from "components/Submit";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Link } from "react-feather";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

interface PostFormProps {
    categories: Category[];
    onSubmit: (data: PostData) => void;
}

interface PostData {
    title: string;
    categoryId: number|undefined;
    content: string;
    featuredImage: string;
}

const PostForm: React.FC<PostFormProps> = ({ categories, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState<number>();
    const [content, setContent] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');

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

    const submit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        onSubmit({title, categoryId, content, featuredImage});
    }


    const options = categories.map(v => {
        return {
            value: v.id,
            label: v.name
        }
    });

    return (
        <Layout>
            <h1 className="mx-5 text-4xl font-bold">New Draft</h1>
            <Form onSubmit={submit} method="post">
                <InputText value={title} onChange={e => setTitle(e.target.value)} name="Title" />
                <ComboBox value={categoryId} onChange={item => setCategoryId(item.value)} name="Category" options={options} />
                <InputText value={featuredImage} onChange={e => setFeaturedImage(e.target.value)} name="Featured Image" />
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

export default PostForm;