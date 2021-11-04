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
                await axios.post('/api/posts', data);
                await Router.push('/posts/drafts');
            } catch (error) {
                console.error(error);
            }
        }} />
    )
}

export default Create;