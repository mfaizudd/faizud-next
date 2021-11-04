import Head from "next/head";
import Header from "./Header";

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Layout: React.FC<LayoutProps> = (props) => {
    const date = new Date().getFullYear().toString();
    return (
        <div className="flex flex-col justify-between">
            <Head>
                <title>{props.title && `${props.title} | `}Faizud.Net</title>
                <meta name="description" content="Muhammad Faizud Daroin's personal website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="container mx-auto flex flex-col">

                { props.children }

            </main>

            <footer className="h-10">
                <div className="container mx-auto px-6">
                    <div className="mt-16 border-t-2 border-gray-300 flex flex-col items-center">
                        <div className="sm:w-2/3 text-center py-6">
                            <p className="text-sm text-blue-700 font-bold mb-2">
                                &copy; 2017 - {date} | Muhammad Faizud Daroin
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Layout;