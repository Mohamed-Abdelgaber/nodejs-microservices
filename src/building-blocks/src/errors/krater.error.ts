export class KraterError extends Error {
  constructor(message: string, public readonly name = 'AppError', public readonly errorCode = 500) {
    super(message);

    Error.captureStackTrace(this, KraterError.captureStackTrace);
  }

  public toString() {
    return `Error: ${this.name} | ${this.message}`;
  }
}
