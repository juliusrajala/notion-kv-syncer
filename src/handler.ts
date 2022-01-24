import { getPosts } from './notion'

export async function handleRequest(request: Request): Promise<Response> {
  const posts = await getPosts()
  console.log('Post', posts)
  return new Response(`request method: ${request.method}`)
}
