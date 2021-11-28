import React from "react";
import Router from "next/router";
import 'react-markdown-editor-lite/lib/index.css';
import { GetServerSideProps, NextPage } from "next";
import prisma from "lib/prisma";
import { Category, Post } from ".prisma/client";
import axios from "axios";
import PostForm, { PostData } from "components/Post/PostForm";
import { toast } from "react-toastify";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const categories = await prisma.category.findMany();
    const post = await prisma.post.findUnique({
        where: { slug: String(context?.params?.slug) }
    })
    return {
        props: {
            post,
            categories
        }
    }
}

interface EditProps {
    post: Post;
    categories: Category[];
}

const Edit: NextPage<EditProps> = ({ post, categories }) => {
    const onSubmit = async (data: PostData) => {
        const toastId = toast.loading("Updating...", { theme: "dark" })
        try {
            await axios.put(`/api/posts/${post.id}/update`, data);
            toast.update(toastId, {
                render: "Updated",
                type: "success",
                isLoading: false,
                autoClose: 5000
            });
            if (post.published) {
                await Router.push('/posts');
            }
            else {
                await Router.push('/posts/drafts');
            }
        } catch (error: any) {
            toast.update(toastId, {
                render: `${error.response.status}: ${error.response.data}`,
                type: "error",
                isLoading: false,
                autoClose: 5000,
                closeButton: true
            });
        }
    }
    return (
        <PostForm
            post={post}
            categories={categories}
            onSubmit={onSubmit} />
    )
}

export default Edit;