import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/client"
import Link from "next/link";
import NavLink from "./NavLink";
import MiniPopup from "./MiniPopup";

const Header: React.FC = () => {
    const [popupHidden, setPopupHidden] = useState(true);
    const [session, loading] = useSession();

    // let popupItems = (
    //     <MiniPopup hidden={popupHidden} >
    //         <Link href="/api/auth/signin">
    //             <a className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-1">Log in</a>
    //         </Link>
    //     </MiniPopup>
    // )
    let popupItems: JSX.Element | null = null;

    if (session) {
        popupItems = (
            <MiniPopup hidden={popupHidden} >
                <Link href="/posts/drafts">
                    <a className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-0">Drafts</a>
                </Link>
                <a onClick={_ => signOut()} href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-1">Sign out</a>
            </MiniPopup>
        )
        // Enable edit buttons and stuff
    }

    const initialMobileMenuStyle = "invisible opacity-0 max-h-0"
    const [mobileMenuStyle, setMobileMenuStyle] = useState(initialMobileMenuStyle);
    const [mobileMenuState, setMobileMenuState] = useState(false);
    const mobileMenuToggle = () => {
        setMobileMenuStyle(mobileMenuState ? "max-h-96" : initialMobileMenuStyle);
        setMobileMenuState(!mobileMenuState)
    }

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button onClick={mobileMenuToggle} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                        </div>
                        <div className="hidden sm:block w-full">
                            <div className="flex space-x-4 w-full justify-center">
                                <NavLink route="/" name="Home" />
                                <NavLink route="/posts" name="Posts" />
                                <NavLink route="/artworks" name="Artworks" />
                            </div>
                        </div>
                    </div>
                    {session && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:relative sm:inset-auto sm:ml-6 sm:pr-0">
                            <button type="button" className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">View notifications</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            <div className="ml-3 relative">
                                <div>
                                    <button type="button" className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                        <span className="sr-only">Open user menu</span>
                                        <div onClick={e => setPopupHidden(!popupHidden)} className="h-8 w-8 rounded-full relative">
                                            <Image className="rounded-full w-full h-full" src={session?.user?.image ?? "/favicon.ico"} layout="fill" alt="" />
                                        </div>
                                    </button>
                                </div>

                                {popupItems}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={`sm:hidden ${mobileMenuStyle} transition-all`} id="mobile-menu">
                <div className="px-2 pt-2 space-y-1">
                    <div className="pb-5">
                        <NavLink name="Home" route="/" />
                    </div>
                    <div className="pb-5">
                        <NavLink name="Posts" route="/posts" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;