/* eslint-disable import/no-unresolved */
// Tests for the scores API
import { dbConnectMock, resetDbMocks } from '@/tests/mocks/dbMocks'
import { userMock, resetUserMocks } from '@/tests/mocks/userMocks'
import {
  scoreMock,
  resetScoreMocks,
  mockScore,
  findOneMock,
  findMock,
  saveMock,
  constructedScoreMock,
  mockGameResult,
  mockBirdKnowledge,
  mockNewKnowledge,
  mockNewGameResult,
} from '@/tests/mocks/scoreMocks'
import { runHandler } from '@/tests/testutils'
import handler from '@/pages/api/scores/[[...scoreslug]]'

// Mock the modules
jest.mock('@/models/dbConnect', () => ({
  __esModule: true,
  default: dbConnectMock,
}))
jest.mock('@/models/user', () => userMock)
jest.mock('@/models/score', () => scoreMock)

beforeEach(() => {
  resetDbMocks()
  resetUserMocks()
  resetScoreMocks()
  jest.clearAllMocks()
})

describe('GET /api/scores/[[...scoreslug]]', () => {
  it('returns 404 and emptyScore if user score not found', async () => {
    findOneMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(null),
    })

    const { res } = await runHandler(handler, 'GET', {
      scoreslug: ['user', 'notfound'],
    })
    expect(res._getStatusCode()).toBe(404)
    expect(res._getJSONData()).toHaveProperty('results')
  })

  it('returns 200 and user score if found', async () => {
    findOneMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(mockScore),
    })

    const { res } = await runHandler(handler, 'GET', {
      scoreslug: ['user', '123'],
    })
    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toMatchObject({ userId: '123' })
  })

  it('returns 404 for team with no users', async () => {
    userMock.User.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([]),
    })

    const { res } = await runHandler(handler, 'GET', {
      scoreslug: ['team', 'teamid'],
    })
    expect(res._getStatusCode()).toBe(404)
    expect(res._getJSONData()).toEqual([])
  })

  it('returns 200 and scores for team with users', async () => {
    userMock.User.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce([{ _id: 'u1' }, { _id: 'u2' }]),
    })
    findMock.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce([mockScore]),
    })

    const { res } = await runHandler(handler, 'GET', {
      scoreslug: ['team', 'teamid'],
    })
    expect(res._getStatusCode()).toBe(200)
    expect(Array.isArray(res._getJSONData())).toBe(true)
    expect(res._getJSONData()[0]).toHaveProperty('userId')
  })
})

describe('POST /api/scores/[[...scoreslug]]', () => {
  it('creates a new score if none exists', async () => {
    // Mock findOne to return null (no existing score)
    findOneMock.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    })

    // Mock the save method to return the expected new score
    saveMock.mockResolvedValueOnce({
      ...mockScore,
      _id: 'newscore',
    })

    // Setup the constructor mock to create our object
    constructedScoreMock.mockImplementationOnce((data) => ({
      ...data,
      _id: 'newscore',
      save: saveMock,
    }))

    const body = {
      userId: '123',
      knowledge: mockBirdKnowledge,
      gameResult: mockGameResult,
    }
    const { res } = await runHandler(handler, 'POST', {}, body)

    expect(res._getStatusCode()).toBe(201)
    expect(saveMock).toHaveBeenCalled()
    expect(constructedScoreMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: '123',
        knowledge: mockBirdKnowledge,
      }),
    )
  })

  it('updates an existing score', async () => {
    // Create a mock score with a mock save method
    const oldScore = {
      ...mockScore,
      save: jest.fn().mockResolvedValueOnce({
        ...mockScore,
        knowledge: [...mockBirdKnowledge, mockNewKnowledge],
        results: [...mockScore.results, mockNewGameResult],
      }),
    }

    // Mock findOne to return the existing score
    findOneMock.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(oldScore),
    })

    const body = {
      userId: '123',
      knowledge: [mockNewKnowledge],
      gameResult: mockNewGameResult,
    }

    const { res } = await runHandler(handler, 'POST', {}, body)

    expect(res._getStatusCode()).toBe(200)
    expect(oldScore.save).toHaveBeenCalled()

    // Check specific properties instead of exact equality
    const responseData = res._getJSONData()
    expect(responseData).toHaveProperty('userId', '123')
    expect(responseData).toHaveProperty('_id', 'score1')
    expect(responseData.knowledge).toHaveLength(2)
    expect(responseData.knowledge[1]).toMatchObject(mockNewKnowledge)
    expect(responseData.results).toHaveLength(2)
    expect(responseData.results[1]).toMatchObject(mockNewGameResult)
  })
})
