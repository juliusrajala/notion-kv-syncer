import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const getClient = () => {
  const client = new Client({
    auth: NOTION_TOKEN,
  })

  return client
}

interface Post {
  visibility: Record<string, any> | null
  tags: Array<Record<string, any>>
  id: string
  name: string
  released: string
  createdtime: string
}

interface WithContent extends Post {
  content: string
  slug: string
}

const fetchPageData = async (
  post: Post,
  client: Client,
): Promise<WithContent> => {
  const markdownFetcher = new NotionToMarkdown({ notionClient: client })
  const blocks = await markdownFetcher.pageToMarkdown(post.id)
  const content = markdownFetcher.toMarkdownString(blocks)
  return {
    ...post,
    content,
    slug: post.name.toLowerCase().replace(/\s+/g, '-'),
  }
}

export const getPosts = async (): Promise<WithContent[]> => {
  const client = getClient()
  const { results } = await client.databases.query({
    database_id: NOTION_DB_ID,
  })

  const parsed: Post[] = results.map((result: any) => {
    const { properties, id, created_time, edited_time, ...rest } = result

    const notionCore = {
      ...properties,
      id,
      createdTime: created_time,
      editedTime: edited_time,
    }
    const values: any = Object.keys(notionCore).reduce((acc, key) => {
      const value =
        key === 'Name'
          ? simplifyNotionProperty<Array<any>>(notionCore[key])[0].plain_text
          : simplifyNotionProperty(notionCore[key] as Record<string, any>)

      return {
        ...acc,
        [key.toLowerCase()]: value,
      }
    }, {} as any)
    return values
  })

  const withContent = parsed.map((post) => fetchPageData(post, client))
  const posts = await Promise.all(withContent)

  return posts
}

function simplifyNotionProperty<R>(value: Record<string, any> | any): R {
  if (typeof value !== 'object') {
    return value
  }
  return value[value.type]
}
