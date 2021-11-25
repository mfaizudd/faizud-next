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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow min-h-0 w-80">
            <div className="md:flex md:flex-row h-full">
                <div className="h-80">
                    <div className="h-48 w-full object-cover md:h-full relative">
                        <Image src={props.image || "/enbandeng.png"} layout="fill" objectFit="cover" alt="Man looking at item at a store" />
                    </div>
                </div>
                <div className="p-8 py-14">
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