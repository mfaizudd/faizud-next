import { Category, Post, User } from ".prisma/client";

type PostItem = Post & {
    author?: User,
    category?: Category
}