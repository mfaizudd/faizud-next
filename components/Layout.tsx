import Head from "next/head";
import styles from '../styles/Home.module.css'

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Layout: React.FC<LayoutProps> = (props) => {
    const date = new Date().getFullYear().toString();
    return (
        <div className={styles.container}>
        <Head>
            <title>{props.title && `${props.title} | `}Faizud.Net</title>
            <meta name="description" content="Muhammad Faizud Daroin's personal website" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>

            { props.children }

        </main>

        <footer className={styles.footer}>
            &copy; 2017 - {date} | Muhammad Faizud Daroin
        </footer>
    </div>
    );
}

export default Layout;