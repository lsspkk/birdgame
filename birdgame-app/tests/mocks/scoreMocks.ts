// Define shared mocks for Score model
export const execMock = jest.fn()
export const selectMock = jest.fn().mockReturnThis()
export const findMock = jest.fn().mockReturnValue({ exec: execMock })
export const findOneMock = jest
  .fn()
  .mockReturnValue({ select: selectMock, exec: execMock })

// Mock for constructing a new Score
export const saveMock = jest.fn()
export const constructedScoreMock = jest.fn()

// Sample game result data
export const mockGameResult = {
  level: '1',
  resultType: 'image',
  scores: [100],
}

// Sample bird knowledge data
export const mockBirdKnowledge = [
  {
    bird: 'sparrow',
    answers: [
      { answerType: 'image', right: 1, wrong: 0 },
      { answerType: 'audio', right: 0, wrong: 1 },
    ],
  },
]

// Additional test data for use in update tests
export const mockNewKnowledge = {
  bird: 'robin',
  answers: [
    { answerType: 'image', right: 2, wrong: 1 },
    { answerType: 'audio', right: 1, wrong: 0 },
  ],
}

export const mockNewGameResult = {
  level: '2',
  resultType: 'audio',
  scores: [85],
}

// Sample test data - basic properties
export const sampleScore = {
  _id: 'score123',
  userId: 'user123',
  results: [],
  knowledge: [],
  save: saveMock,
}

// Complete mock score with proper structure
export const mockScore = {
  ...sampleScore,
  _id: 'score1',
  userId: '123',
  knowledge: mockBirdKnowledge,
  results: [mockGameResult],
}

/**
 * Configure jest.mock for Score model
 * Usage: Place this at the top of your test file:
 * jest.mock('@/models/score', () => scoreMock);
 */
export const scoreMock = {
  // Mock for static methods
  Score: Object.assign(
    // Constructor function
    function (...args) {
      // When Score is instantiated, return the constructed mock
      return constructedScoreMock(...args)
    },
    // Static properties
    {
      find: findMock,
      findOne: findOneMock,
    },
  ),
}

/**
 * Reset all score mocks
 * Call this in beforeEach
 */
export function resetScoreMocks() {
  execMock.mockReset()
  findMock.mockReset()
  findOneMock.mockReset()
  selectMock.mockClear()
  saveMock.mockReset()

  // Set default implementation for constructedScoreMock
  constructedScoreMock.mockImplementation((data) => ({
    ...sampleScore,
    ...data,
    save: saveMock,
  }))
}
