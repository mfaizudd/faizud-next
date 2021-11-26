import { getSession } from "next-auth/client";
import prisma from "lib/prisma";
import { NextApiHandler } from "next";

const Post: NextApiHandler = async (req, res) => {
    const {
        query,
        body,
        method
    } = req;
    switch (method) {
        case 'GET':
            const { take, skip, published } = query;
            const posts = await prisma.post.findMany({
                where: { published: published === "true" },
                include: {
                    author: true,
                    category: true
                },
                orderBy: { createdAt: "desc" },
                take: Number(take),
                skip: Number(skip)
            });
            const total = await prisma.post.count({ where: { published: published === "true" } });
            res.status(200).json({ posts, total });
            break;
        case 'POST': {
            try {
                let { title, slug, categoryId, featuredImage, content } = body;
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
                const result = await prisma.post.create({
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
                        content,
                        author: { connect: { email: session?.user?.email as string | undefined } }
                    }
                });
                res.json(result);
            } catch (error: any) {
                res.status(400).json(error.message);
            }
        }

        default:
            res.status(405).end("Method not allowed");
            break;
    }
}

export default Post;