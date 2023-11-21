export class RecordserStreamingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecordserStreamingError";
  }
}
