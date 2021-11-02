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
        case 'POST':
            const { title, content } = body;
            const session = await getSession({ req });
            const result = await prisma.post.create({
                data: {
                    title,
                    content,
                    author: { connect: { email: session?.user?.email as string | undefined } }
                }
            });
            res.json(result);
        case 'GET':
            const { take, skip, published } = query;
            const posts = await prisma.post.findMany({
                where: { published: published==="true" },
                include: {
                    author: true
                },
                orderBy: { createdAt: "desc" },
                take: Number(take),
                skip: Number(skip)
            });
            const total = await prisma.post.count({where: {published: published==="true"}});
            res.status(200).json({posts, total});
            break;

        default:
            res.status(405).end("Method not allowed");
            break;
    }
}

export default Post;