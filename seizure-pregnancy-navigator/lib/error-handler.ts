export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public source: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown, source: string) {
  if (error instanceof APIError) {
    return {
      error: error.message,
      status: error.status,
      source: error.source
    }
  }
  
  return {
    error: 'Unknown error occurred',
    status: 500,
    source
  }
}

export function createErrorResponse(error: unknown, source: string, status = 500) {
  const errorInfo = handleAPIError(error, source)
  
  return {
    success: false,
    error: errorInfo.error,
    source: errorInfo.source,
    timestamp: new Date().toISOString(),
    status: errorInfo.status
  }
}
