import prisma from "lib/prisma";
import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";

const deletePost: NextApiHandler = async (req, res) => {
    const session = await getSession({req})
    const {
        query: {id},
        method
    } = req;
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email ?? ""
        }
    });
    if (user?.role != "Admin") {
        res.status(401).end("Unauthorized");
        return;
    }
    const post = await prisma.post.findUnique({
        include: {author: true},
        where: {id: Number(id)}
    })
    if (!session || session?.user?.email !== post?.author.email) {
        res.status(401).end("You don't have permission to delete this post");
        return;
    }
    if (method === "DELETE") {
        const post = await prisma.post.delete({
            where: {id: Number(id)}
        });
        res.json(post);
    }
    else {
        throw new Error(
            `The HTTP ${method} method is not supported at this route`
        );
    }
}

export default deletePost;