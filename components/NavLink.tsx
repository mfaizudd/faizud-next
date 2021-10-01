import { useRouter } from 'next/router';
import Link from 'next/link';

interface NavLinkProps {
    route: string;
    name: string;
}

const NavLink: React.FC<NavLinkProps> = ({route, name}) => {
    const router = useRouter();
    const active = route === router.pathname;
    let classNames = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
    if (active) {
        classNames = "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
    }
    return (
        <Link href={route}>
            <a className={classNames} aria-current="page">{name}</a>
        </Link>
    )
}

export default NavLink;