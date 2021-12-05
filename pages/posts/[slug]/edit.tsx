import React, { useState } from "react";
import Router from "next/router";
import 'react-markdown-editor-lite/lib/index.css';
import { GetServerSideProps, NextPage } from "next";
import prisma from "lib/prisma";
import { Category, Post, User } from ".prisma/client";
import axios from "axios";
import PostForm, { PostData } from "components/Post/PostForm";
import { toast } from "react-toastify";
import { getSession } from "next-auth/client";
import Error from "next/error";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const loggedInUser = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? "" }
    });
    const categories = await prisma.category.findMany();
    const post = await prisma.post.findUnique({
        where: { slug: String(context?.params?.slug) }
    })
    return {
        props: {
            post,
            categories,
            loggedInUser
        }
    }
}

interface EditProps {
    post: Post;
    categories: Category[];
    loggedInUser: User;
}

const Edit: NextPage<EditProps> = ({ post, categories, loggedInUser }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    if (loggedInUser.role != "Admin") {
        return <Error statusCode={401} title="Unauthorized" />
    }
    const onSubmit = async (data: PostData) => {
        if (isUpdating) {
            toast.error("Update in progress", {theme: "dark"});
            return;
        }
        setIsUpdating(true);
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
        finally {
            setIsUpdating(false);
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