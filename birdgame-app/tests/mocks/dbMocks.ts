/**
 * Mock for dbConnect
 * Usage: Place this at the top of your test file:
 * jest.mock('@/models/dbConnect', () => dbConnectMock);
 */
export const dbConnectMock = jest.fn()

/**
 * Reset database mocks
 * Call this in beforeEach
 */
export function resetDbMocks() {
  dbConnectMock.mockReset()
}
