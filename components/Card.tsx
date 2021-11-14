import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
    image?: string | null;
    category?: string;
    title?: string;
    description?: string;
    route?: string;
}

const Card: React.FC<CardProps> = (props) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow min-h-0">
            <div className="md:flex h-full">
                <div className="md:flex-shrink-0">
                    <div className="h-48 w-full object-cover md:h-full md:w-48 relative">
                        <Image src={props.image || "/enbandeng.png"} layout="fill" objectFit="cover" alt="Man looking at item at a store" />
                    </div>
                </div>
                <div className="p-8 py-16">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{props.category}</div>
                    <Link href={props.route ?? "#"}>
                        <a className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{props.title}</a>
                    </Link>
                </div>
            </div>
            {props.children}
        </div>
    )
}

export default Card;