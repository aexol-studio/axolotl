import {
  getErrorMessages,
  isAuthInvalidationError,
  isNetworkLikeError,
} from './sessionPolicy'

describe('sessionPolicy', () => {
  it('detects auth invalidation marker in graphql errors', () => {
    const error = {
      response: {
        errors: [
          {
            message: 'UNAUTHENTICATED: token expired',
          },
        ],
      },
    }

    expect(isAuthInvalidationError(error)).toBe(true)
  })

  it('detects network-like errors by message', () => {
    expect(isNetworkLikeError(new Error('Network request failed'))).toBe(true)
  })

  it('collects readable error messages', () => {
    const error = {
      message: 'Top-level message',
      response: {
        errors: [
          {
            message: 'Nested graphql message',
          },
        ],
      },
    }

    expect(getErrorMessages(error)).toEqual([
      'Top-level message',
      'Nested graphql message',
    ])
  })
})
