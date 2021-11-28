import React from "react";
import Router from "next/router";
import 'react-markdown-editor-lite/lib/index.css';
import { GetServerSideProps, NextPage } from "next";
import prisma from "lib/prisma";
import { Category } from ".prisma/client";
import axios from "axios";
import PostForm, { PostData } from "components/Post/PostForm";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const categories = await prisma.category.findMany();
    return {
        props: {
            categories
        }
    }
}

interface CreateProps {
    categories: Category[];
}

const Create: NextPage<CreateProps> = ({ categories }) => {
    const create = async (data: PostData) => {
        const toastId = toast.loading("Creating...", { theme: "dark" });
        try {
            const response = await axios.post('/api/posts', data);
            if (response.status === 200) {
                toast.update(toastId, {
                    render: "Created",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000
                });
                await Router.push('/posts/drafts');
            }
        } catch (error: any) {
            toast.update(toastId, {
                render: `${error.response.status}: ${error.response.data}`,
                type: "error",
                isLoading: false,
                autoClose: 5000
            });
        }
    }
    return (
        <PostForm categories={categories} onSubmit={create} />
    )
}

export default Create;