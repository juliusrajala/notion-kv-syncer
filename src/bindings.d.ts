export {}

declare global {
  const POSTS: KVNamespace
  const NOTION_TOKEN: string
  const NOTION_DB_ID: string
}

declare namespace env {
  const NOTION_TOKEN: string
  const NOTION_DB_ID: string
}
