export class ExcelGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExcelGenerationError";
  }
}
