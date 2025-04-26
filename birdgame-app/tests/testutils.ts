import { NextApiHandler } from 'next'
import { createMocks, RequestMethod } from 'node-mocks-http'

export async function runHandler(
  handler: NextApiHandler,
  method: RequestMethod,
  query: Record<string, unknown> = {},
  body: Record<string, unknown> | undefined = undefined,
) {
  const { req, res } = createMocks({ method, query, body })
  await handler(req, res)
  return { req, res }
}
