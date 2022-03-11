import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Post, { getStaticProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../pages/services/prismic'

const post = {
  slug: 'test-new-post',
  title: 'Title for new post',
  content: '<p>Post excerpt</p>',
  updatedAt: '25 de Dezembro de 2021'
}

jest.mock('../../pages/services/prismic')

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    }
  }
})

describe('Post page', () => {
  test("renders correctly", () => {
    const { getByText } = render(
      <Post post={post} />
    )

    expect(getByText('Title for new post')).toBeInTheDocument()
  })

  test("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValue({
        data: {
          title: [
            { type: 'heading', text: 'My new Post' }
          ],
          content: [
            { type: 'paragraph', text: '<p>Post excerpt</p>' }
          ]
        },
        last_publication_date: '12-25-2021',
      })
    } as any)

    const response = await getStaticProps({
      params: { slug: 'test-new-post' }
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
              slug: 'test-new-post',
              title: 'My new Post',
              content: '<p>Post excerpt</p>',
              updatedAt: '25 de dezembro de 2021'
          }
        },
        revalidate: 43200,
      }),
    )
  })
})

