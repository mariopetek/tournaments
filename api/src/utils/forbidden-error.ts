export class ForbiddenError extends Error {
    status = 403
    message = 'Forbidden'
}
