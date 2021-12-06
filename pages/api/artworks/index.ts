import { getSession } from "next-auth/client";
import prisma from "lib/prisma";
import { NextApiHandler } from "next";

const Artwork: NextApiHandler = async (req, res) => {
    const {
        query,
        method
    } = req;
    switch (method) {
        case 'GET':
            const { take, skip, published } = query;
            const artworks = await prisma.post.findMany({
                where: {
                    published: published === "true",
                    category: {
                        name: "Artwork"
                    }
                },
                include: {
                    author: true,
                    category: true
                },
                orderBy: { createdAt: "desc" },
                take: Number(take),
                skip: Number(skip)
            });
            const total = await prisma.post.count({ where: { published: published === "true" } });
            res.status(200).json({ artworks, total });
            break;

        default:
            res.status(405).end("Method not allowed");
            break;
    }
}

export default Artwork;