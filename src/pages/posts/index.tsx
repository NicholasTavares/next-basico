import { GetStaticProps } from "next"
import Link from "next/link"
import { RichText } from 'prismic-dom'
import SEO from "../../components/SEO"
import { getPrismicClient } from "../services/prismic"
import styles from './posts.module.scss'
import Prismic from '@prismicio/client'

interface IPost {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface IPostData {
  slug: string;
  title: string;
  content: IContentData[];
  updatedAt: string;
}

interface IContentData {
  type: string
  text: string
}

interface IPostsProps {
  posts: IPost[]
}

export default function Posts({ posts }: IPostsProps) {
  return (
    <>
      <SEO title="Posts" />
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query<IPostData>([
    Prismic.predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.content']
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60 * 12, // 12 horas
  };
};
