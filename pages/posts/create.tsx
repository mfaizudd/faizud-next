import React from "react";
import Router from "next/router";
import 'react-markdown-editor-lite/lib/index.css';
import { GetServerSideProps, NextPage } from "next";
import prisma from "lib/prisma";
import { Category } from ".prisma/client";
import axios from "axios";
import PostForm from "components/Post/PostForm";

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
    return (
        <PostForm categories={categories} onSubmit={async data => {
            try {
                const response = await axios.post('/api/posts', data);
                if (response.status === 200)
                    await Router.push('/posts/drafts');
            } catch (error:any) {
                console.log(error.response);
            }
        }} />
    )
}

export default Create;