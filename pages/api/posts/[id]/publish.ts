import prisma from "lib/prisma";
import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";

const Publish: NextApiHandler = async (req, res) => {
    const session = await getSession({ req });
    const {
        query: {id},
        method
    } = req;
    const post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: { author: true }
    });
    if (!session || session?.user?.email !== post?.author?.email) {
        res.status(401);
        return;
    }
    switch (method) {
        case 'PUT':
            const post = await prisma.post.update({
                where: { id: Number(id) },
                data: { published: true }
            });
            res.json(post);
            break;
    
        default:
            res.status(405).end("Method not allowed");
            break;
    }
}

export default Publish;