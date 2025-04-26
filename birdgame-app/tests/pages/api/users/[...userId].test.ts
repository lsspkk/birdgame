// To run these tests, ensure you have jest and node-mocks-http installed:
// npm install --save-dev jest @types/jest node-mocks-http
// You may also need to configure jest for Next.js API route testing.

// Import mock modules
import {
  userMock,
  execMock,
  findByIdMock,
  sampleUser,
  resetUserMocks,
} from '@/tests/mocks/userMocks'
import { dbConnectMock, resetDbMocks } from '@/tests/mocks/dbMocks'

// Setup mocks before importing handler
jest.mock('@/models/user', () => userMock)
jest.mock('@/models/dbConnect', () => dbConnectMock)

// Import the handler and utilities
import handler from '@/pages/api/users/[...userId]'
import { runHandler } from '@/tests/testutils'

// Create a local mock for save that we can control in tests
const mockSave = jest.fn()

describe('/api/users/[...userId] API', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
    resetUserMocks()
    resetDbMocks()
    // Update sampleUser to use our local mockSave
    sampleUser.save = mockSave
  })

  it('PUT returns 401 if user not found', async () => {
    findByIdMock.mockResolvedValue(undefined)
    const { res } = await runHandler(
      handler,
      'PUT',
      { userId: ['123'] },
      { password: 'pw' },
    )
    expect(res._getStatusCode()).toBe(401)
    expect(JSON.parse(res._getData())).toHaveProperty('error')
  })

  it('PUT updates and returns user if found', async () => {
    findByIdMock.mockResolvedValue({ ...sampleUser })
    mockSave.mockResolvedValue({})
    const { res } = await runHandler(
      handler,
      'PUT',
      { userId: ['123'] },
      { password: 'pw' },
    )
    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toHaveProperty('_id', '123')
  })

  it('GET returns 404 if no users found', async () => {
    execMock.mockResolvedValueOnce([])
    const { res } = await runHandler(handler, 'GET', { userId: ['123'] })
    expect(res._getStatusCode()).toBe(404)
  })

  it('GET returns user if found', async () => {
    execMock.mockResolvedValueOnce([{ _id: '123', username: 'test' }])
    const { res } = await runHandler(handler, 'GET', { userId: ['123'] })
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toHaveProperty('_id', '123')
  })
})
