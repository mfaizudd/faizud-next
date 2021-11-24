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
    const existingPost = await prisma.post.findFirst({
        where: {
            slug: { contains: slug }
        },
        orderBy: { slug: 'desc' }
    });
    if (existingPost !== null) {
        let lastNumber = Number(existingPost.slug.slice(slug.length));
        let originalSlug = existingPost.slug.slice(0, slug.length);
        slug = `${originalSlug}${lastNumber + 1}`
    }
    const result = await prisma.post.update({
        where: { id: Number(id) },
        data: {
            title,
            slug,
            category: categoryId ? {
                connectOrCreate: {
                    create: {
                        name: categoryId
                    },
                    where: {
                        id: Number(categoryId) ? Number(categoryId) : -1
                    }
                }
            } : undefined,
            featuredImage,
            content
        }
    });
    res.json(result);
}

export default UpdatePost;