import { AppError } from "../utils/error.utils.js"

// Converte qualquer erro numa resposta JSON consistente.
export function errorHandler(error, req, res, next) {
  console.error(error)

  // Erros esperados mantêm a mensagem e o código definidos.
  if (error instanceof AppError || error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details && { details: error.details }),
    })
  }

  // Erros inesperados devolvem uma resposta genérica.
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
    error: error.message,
  })
}
