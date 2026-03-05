type GraphQLErrorLike = {
  response?: {
    errors?: Array<{
      message?: string
    }>
  }
  message?: string
}

const isGraphQLErrorLike = (error: unknown): error is GraphQLErrorLike => {
  if (!error || typeof error !== 'object') {
    return false
  }

  return 'message' in error || 'response' in error
}

const toMessage = (value: unknown) => {
  if (typeof value === 'string') {
    return value
  }

  if (value instanceof Error) {
    return value.message
  }

  if (isGraphQLErrorLike(value) && typeof value.message === 'string') {
    return value.message
  }

  return ''
}

const AUTH_INVALIDATION_MARKERS = [
  'unauthorized',
  'unauthenticated',
  'forbidden',
  'invalid token',
  'token expired',
  'not authenticated',
  'auth',
]

const NETWORK_MARKERS = [
  'network',
  'failed to fetch',
  'network request failed',
  'timeout',
]

const includesAnyMarker = (value: string, markers: readonly string[]) =>
  markers.some((marker) => value.includes(marker))

export const getErrorMessages = (error: unknown) => {
  const messages = new Set<string>()
  const directMessage = toMessage(error).trim()

  if (directMessage) {
    messages.add(directMessage)
  }

  if (isGraphQLErrorLike(error)) {
    const graphqlErrors = error.response?.errors ?? []
    graphqlErrors.forEach((entry) => {
      if (typeof entry.message === 'string' && entry.message.trim()) {
        messages.add(entry.message.trim())
      }
    })
  }

  return Array.from(messages)
}

export const isAuthInvalidationError = (error: unknown) =>
  getErrorMessages(error)
    .map((message) => message.toLowerCase())
    .some((message) => includesAnyMarker(message, AUTH_INVALIDATION_MARKERS))

export const isNetworkLikeError = (error: unknown) =>
  getErrorMessages(error)
    .map((message) => message.toLowerCase())
    .some((message) => includesAnyMarker(message, NETWORK_MARKERS))
