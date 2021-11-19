import { Category, Post } from "@prisma/client";
import CodeBlock from "components/CodeBlock";
import ComboBox from "components/ComboBox";
import Form from "components/Form";
import { Heading1, Heading2, Heading3 } from "components/Headings";
import InputText from "components/InputText";
import Layout from "components/Layout";
import Submit from "components/Submit";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Joi, { string } from "joi";

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

interface PostFormProps {
    post?: Post;
    categories: Category[];
    onSubmit: (data: PostData) => void;
}

interface PostData {
    title: string;
    slug: string;
    categoryId: string | undefined;
    content: string;
    featuredImage: string;
}

const PostForm: React.FC<PostFormProps> = ({ post, categories, onSubmit }) => {
    const [title, setTitle] = useState(post?.title ?? "");
    const [slug, setSlug] = useState(post?.slug ?? "");
    const [categoryId, setCategoryId] = useState(post?.categoryId?.toString());
    const [content, setContent] = useState(post?.content ?? "");
    const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ?? "");
    const [errors, setErrors] = useState<{ key: string, message: string }[]>();

    let schema = Joi.object({
        title: Joi.string().required(),
        slug: Joi.string().required(),
        categoryId: Joi.string(),
        content: Joi.string().required(),
        featuredImage: Joi.string().uri().allow("")
    });

    useEffect(() => {
        setSlug(title.toLocaleLowerCase().replaceAll(" ", "-"));
    }, [title])

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
        const data = {
            title,
            slug,
            categoryId,
            content,
            featuredImage
        }
        try {
            await schema.validateAsync(data, { abortEarly: false });
            onSubmit(data);
        } catch (error: any) {
            const errorDetails = error.details.map((item: any) => {
                const key = item.path.join(".");
                const message = item.message;
                return {
                    key,
                    message
                }
            });
            setErrors(errorDetails);
            console.log(errorDetails);
        }
    }

    const options: {
        value?: string;
        label: string;
    }[] = categories.map(v => {
        return {
            value: v.id.toString(),
            label: v.name
        }
    });

    options.splice(0, 0, { value: undefined, label: "Uncategorized" })

    const getErrors = (field: string) => {
        return errors
            ?.filter(x => x.key == field)
            ?.map(x => x.message);
    }

    return (
        <Layout>
            <h1 className="mx-5 text-4xl font-bold">New Draft</h1>
            <Form onSubmit={submit} method="post">
                <InputText
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    name="Title"
                    errors={getErrors("title")} />
                <InputText
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    name="Slug"
                    errors={getErrors("slug")} />
                <ComboBox
                    value={options.find(o => o.value === categoryId)}
                    onChange={item => setCategoryId(item.value)}
                    name="Category" options={options}
                    errors={getErrors("categoryId")} />
                <InputText
                    value={featuredImage}
                    onChange={e => setFeaturedImage(e.target.value)}
                    name="Featured Image"
                    errors={getErrors("featuredImage")} />
                <div className="px-3 my-3 w-full">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => render(text)}
                        value={content}
                        onChange={({ text }) => setContent(text)}
                    />
                    <ul className="list-disc px-3">
                        {getErrors("content")?.map((error, index) => (
                            <li key={index} className="text-red-500 text-xs italic list-item">{error}</li>
                        ))}
                    </ul>
                </div>
                <div className="px-3 my-3">
                    <Submit label="Submit" />
                    <Link href="/posts">
                        <a> or Cancel</a>
                    </Link>
                </div>
            </Form>
        </Layout>
    );

}

export default PostForm;