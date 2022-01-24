import { getPosts } from './notion'

export async function handleRequest(request: Request): Promise<Response> {
  const list = await POSTS.list()
  console.log(list)
  const posts = await getPosts()
  for (const post of posts) {
    await POSTS.put(post.slug, JSON.stringify(post), {
      metadata: {
        id: post.id,
        visibility: post.visibility,
        name: post.name,
        createdTime: post.createdtime,
      },
    })
  }
  return new Response(`request method: ${request.method}`)
}
