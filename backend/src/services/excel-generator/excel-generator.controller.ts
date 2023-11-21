import { Readable } from "stream";
import {
  ColumnDefinitions,
  WorksheetDefinitions,
} from "./excel-generator.types";
import {
  extractFilenameFromFilePath,
  formatRecordsetsFromLayoutConfig,
  getExcelReportConfig,
} from "./excel-generator.helpers";
import {
  MSSQLFingerprintCreator,
  MSSQLRowTransformer,
} from "../mssql-recordset-streaming/mssql-recordset-streaming.transformers";
import { ReportExcelTransformer } from "./excel-generator.transformers";

export interface GenerateExcelReportOutput {
  excelStream: Readable;
  filename: string;
}

export async function generateExcelReport(
  reportBaseName: string,
  reportWorksheets: WorksheetDefinitions[],
  reportColumnDefinitions: ColumnDefinitions[],
  dataStream: Readable,
) {
  return new Promise<GenerateExcelReportOutput>(async (resolve, reject) => {
    try {
      const { filePath, layoutConfig } = getExcelReportConfig(
        reportBaseName,
        reportWorksheets,
        reportColumnDefinitions,
      );
      const recordSets = formatRecordsetsFromLayoutConfig(layoutConfig);
      const filename = extractFilenameFromFilePath(filePath as string);

      const pipeline = dataStream
        .on("error", (error: any) => {
          reject(error);
        })
        .pipe(new MSSQLFingerprintCreator())
        .pipe(new MSSQLRowTransformer(recordSets))
        .pipe(new ReportExcelTransformer({ layoutConfig, filePath }));

      resolve({ excelStream: pipeline, filename });
    } catch (error) {
      reject(error);
    }
  });
}
