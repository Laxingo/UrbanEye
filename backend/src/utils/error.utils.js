export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message)

    this.name = "AppError"
    this.statusCode = statusCode
    this.details = details
    this.isOperational = true
  }
}

export function validationError(message = "Invalid request.", details = null) {
  return new AppError(message, 400, details)
}

export function unauthorizedError(message = "Authentication is required.") {
  return new AppError(message, 401)
}

export function forbiddenError(message = "You do not have permission to perform this action.") {
  return new AppError(message, 403)
}

export function notFoundError(resource = "Resource") {
  return new AppError(`${resource} not found.`, 404)
}

export function conflictError(message = "Conflict with existing data.") {
  return new AppError(message, 409)
}

export function serverError(message = "Internal server error.") {
  return new AppError(message, 500)
}