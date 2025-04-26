// Define shared mocks for User model
export const execMock = jest.fn()
export const selectMock = jest.fn().mockReturnThis()
export const findMock = jest
  .fn()
  .mockReturnValue({ select: selectMock, exec: execMock })
export const findByIdMock = jest.fn()

// Sample test data
export const sampleUser = { _id: '123', username: 'test', save: jest.fn() }

/**
 * Configure jest.mock for User model
 * Usage: Place this at the top of your test file:
 * jest.mock('@/models/user', () => userMock);
 */
export const userMock = {
  User: {
    findById: findByIdMock,
    find: findMock,
  },
}

/**
 * Reset all user mocks
 * Call this in beforeEach
 */
export function resetUserMocks() {
  execMock.mockReset()
  findByIdMock.mockReset()
  selectMock.mockClear()
  findMock.mockClear()
}
