import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
    image?: string;
    category?: string;
    title?: string;
    description?: string;
    route?: string;
}

const Card: React.FC<CardProps> = (props) => {
    return (
        <div className="mx-5 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl hover:shadow-2xl transition-shadow flex-grow">
            <div className="md:flex">
                <div className="md:flex-shrink-0">
                    <div className="h-48 w-full object-cover md:h-full md:w-48 relative">
                        <Image src={props.image ?? "/favicon.ico"} layout="fill" objectFit="cover" alt="Man looking at item at a store"/>
                    </div>
                </div>
                <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{ props.category }</div>
                <Link href={props.route ?? "#"}>
                    <a className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{ props.title }</a>
                </Link>
                <p className="mt-2 text-gray-500">{ props.description }</p>
                </div>
            </div>
        </div>
    )
}

export default Card;