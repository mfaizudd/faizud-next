import { getSession } from 'next-auth/client';
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
    const session = await getSession({ req });
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email ?? ""
        }
    });
    if (user?.role != "Admin") {
        res.status(401).end("Unauthorized");
        return;
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
            } : {
                disconnect: true
            },
            featuredImage,
            content
        }
    });
    res.json(result);
}

export default UpdatePost;