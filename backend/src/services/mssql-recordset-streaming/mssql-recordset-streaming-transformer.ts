import { Transform, TransformCallback } from "stream";

export class RecordsetStreamingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecordsetStreamingError";
  }
}

function chunkIsRecordsetName(chunk: any): boolean {
  const keys = Object.keys(chunk);
  return keys.length === 1 && keys[0] === "recordsetName";
}

export class MSSQLRecordsetTransformer extends Transform {
  private currentRecordsetName: string | undefined;
  constructor() {
    super({ objectMode: true });
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    try {
      if (chunkIsRecordsetName(chunk)) {
        this.currentRecordsetName = chunk.recordsetName;
        callback(null);
      } else {
        if (!this.currentRecordsetName) {
          throw new RecordsetStreamingError(
            "Recordset id not found for row data"
          );
        }

        const rowData = chunk;

        callback(null, {
          recordsetName: this.currentRecordsetName,
          rowData,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        callback(error);
      }
    }
  }
}
