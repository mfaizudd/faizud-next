import prisma from "lib/prisma";
import { NextApiHandler } from "next";

const deletePost: NextApiHandler = async (req, res) => {
    const {
        query: {id},
        method
    } = req;
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