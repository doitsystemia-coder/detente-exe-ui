export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export const notFound = (entity: string) => new AppError(`${entity} not found`, 404);
