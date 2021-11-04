import prisma from "lib/prisma";
import { NextApiHandler } from "next";

const UpdatePost: NextApiHandler = async (req, res) => {
    const {
        query: { id },
        body,
        method
    } = req;
    if (method !== "PUT") {
        return res.status(405).end("Method not allowed");
    }
    let { title, slug, categoryId, featuredImage, content } = body;
    const result = await prisma.post.update({
        where: { id: Number(id) },
        data: {
            title,
            slug,
            category: categoryId >= 0 ? { connect: { id: categoryId } } : { disconnect: true },
            featuredImage,
            content
        }
    });
    res.json(result);
}

export default UpdatePost;