import { Transform, TransformCallback } from "stream";
import { RecordserStreamingError } from "./mssql-recordset-streaming.classes";
import { Recordset } from "./mssql-recordset-streaming.types";
import { createFingerprintFromRowdata } from "./mssql-recordset-streaming.helpers";

export class MSSQLFingerprintCreator extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    try {
      const rowData = chunk;
      const fingerPrint = createFingerprintFromRowdata(rowData);
      callback(null, { fingerPrint, rowData });
    } catch (error: any) {
      callback(error);
    }
  }
}

export class MSSQLRowTransformer extends Transform {
  private currentFingerPrint: string | undefined;
  private currentSheetIndex: number = 0;
  private currentRecordset: Recordset = { name: "" };

  constructor(private recordsets: Recordset[]) {
    super({ objectMode: true });
    this.currentRecordset = this.findRecordset(this.currentSheetIndex);
  }

  checkIfFingerprintIsChanged(fingerPrint: string): boolean {
    if (fingerPrint !== this.currentFingerPrint) {
      this.currentFingerPrint = fingerPrint;
      return true;
    }
    return false;
  }

  gotoNextRecordset(): void {
    this.currentRecordset = this.findRecordset(this.currentSheetIndex);
    this.currentSheetIndex++;
  }

  findRecordset(index: number): Recordset {
    const recordset = this.recordsets[index];
    if (!recordset) {
      throw new RecordserStreamingError(
        `Recordset not found for index: ${index}`,
      );
    }
    return recordset;
  }

  _transform(chunk: any, encoding: string, callback: Function) {
    try {
      const { rowData, fingerPrint } = chunk;
      const fingerprintHasChanged =
        this.checkIfFingerprintIsChanged(fingerPrint);
      if (fingerprintHasChanged) {
        this.gotoNextRecordset();
      }
      callback(null, { recordsetName: this.currentRecordset.name, rowData });
    } catch (error: any) {
      callback(error);
    }
  }
}
