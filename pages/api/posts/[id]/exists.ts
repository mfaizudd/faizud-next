import prisma from "lib/prisma";
import { NextApiHandler } from "next";

const Exists: NextApiHandler = async (req, res) => {
    const {
        query: {id: slug},
        method
    } = req;
    if (method === "GET") {
        const post = await prisma.post.findUnique({
            where: {slug: String(slug)}
        });
        res.json(Boolean(post));
    }
    else {
        throw new Error(
            `The HTTP ${method} method is not supported at this route`
        );
    }
}

export default Exists;