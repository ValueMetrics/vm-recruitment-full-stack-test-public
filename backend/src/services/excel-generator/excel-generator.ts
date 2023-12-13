import { Readable } from "stream";
import {
  ColumnDefinitions,
  WorksheetDefinitions,
} from "./excel-generator-types";
import {
  extractFilenameFromFilePath,
  getExcelReportConfig,
} from "./excel-generator-helpers";
import { MSSQLRecordsetTransformer } from "../mssql-recordset-streaming/mssql-recordset-streaming-transformer";
import { ReportExcelTransformer } from "./excel-generator-transformer";

export interface GenerateExcelReportOutput {
  excelStream: Readable;
  filename: string;
}

export async function generateExcelReport(
  reportBaseName: string,
  reportWorksheets: WorksheetDefinitions[],
  reportColumnDefinitions: ColumnDefinitions[],
  dataStream: Readable
) {
  return new Promise<GenerateExcelReportOutput>(async (resolve, reject) => {
    try {
      const { filePath, layoutConfig } = getExcelReportConfig(
        reportBaseName,
        reportWorksheets,
        reportColumnDefinitions
      );
      const filename = extractFilenameFromFilePath(filePath as string);

      const pipeline = dataStream
        .on("customError", (error) => {
          reject(error);
        })
        .pipe(new MSSQLRecordsetTransformer())
        .pipe(new ReportExcelTransformer({ layoutConfig, filePath }));

      resolve({ excelStream: pipeline, filename });
    } catch (error) {
      reject(error);
    }
  });
}
