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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow min-h-0 md:w-80">
            <div className="h-full relative">
                <div className="h-80 w-full">
                    <div className="w-full object-cover h-full relative">
                        <Image src={props.image || "/enbandeng.png"} layout="fill" objectFit="cover" alt={props.title}/>
                    </div>
                </div>
                <Link href={props.route ?? "#"} passHref={true}>
                    <div className="absolute p-8 py-8 left-0 top-0 md:opacity-0 hover:opacity-100 w-full h-full transition-all bg-gradient-to-b from-black to-transparent cursor-pointer">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{props.category}</div>
                        <Link href={props.route ?? "#"}>
                            <a className="block mt-1 text-lg leading-tight font-medium text-white hover:underline">{props.title}</a>
                        </Link>
                    </div>
                </Link>
            </div>
            {props.children}
        </div>
    )
}

export default Card;