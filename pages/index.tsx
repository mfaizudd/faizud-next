import type { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout';
import Card from 'components/Card';
import styles from 'styles/Home.module.css';

const Home: NextPage = () => {
  const date = new Date().getFullYear().toString();
  return (
    <Layout title="Index">
      <h1 className={styles.title}>
      Faizud.Net
      </h1>

      <p className={styles.description}>
      {"Muhammad Faizud Daroin's personal website"}
      </p>
      <Link href="/posts">Posts</Link>
      <Card 
        image="https://u.cubeupload.com/mfaizudd/mh014byfaizuddde8rdx.jpg" 
        category="Case study"
        title="Lmao"
        description="bjirrrr"
        route="/posts"
        />
    </Layout>
  )
}

export default Home
