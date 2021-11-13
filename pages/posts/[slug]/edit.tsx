import React from "react";
import Router from "next/router";
import 'react-markdown-editor-lite/lib/index.css';
import { GetServerSideProps, NextPage } from "next";
import prisma from "lib/prisma";
import { Category, Post } from ".prisma/client";
import axios from "axios";
import PostForm from "components/Post/PostForm";

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
    return (
        <PostForm
            post={post}
            categories={categories}
            onSubmit={async data => {
                try {
                    await axios.put(`/api/posts/${post.id}/update`, data);
                    await Router.push('/posts');
                } catch (error:any) {
                    console.error(error);
                }
            }} />
    )
}

export default Edit;