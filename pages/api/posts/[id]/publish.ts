import prisma from "lib/prisma";
import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";

const Publish: NextApiHandler = async (req, res) => {
    const session = await getSession({ req });
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
        where: { id: Number(id) },
        include: { author: true }
    });
    if (!session || session?.user?.email !== post?.author?.email) {
        res.status(401).end("Unauthorized");
        return;
    }
    switch (method) {
        case 'PUT':
            const post = await prisma.post.update({
                where: { id: Number(id) },
                data: { published: true }
            });
            res.status(200).json(post);
            break;
    
        default:
            res.status(405).end("Method not allowed");
            break;
    }
}

export default Publish;