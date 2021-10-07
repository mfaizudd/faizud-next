import prisma from "lib/prisma";
import { NextApiHandler } from "next";

const Publish: NextApiHandler = async (req, res) => {
    const {
        query: {id},
        method
    } = req;
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