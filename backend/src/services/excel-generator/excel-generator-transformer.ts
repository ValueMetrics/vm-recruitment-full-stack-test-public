import { PassThrough, Transform, TransformCallback } from "stream";
import Excel from "exceljs";

import { ExcelReportConfig, ReportSheetLayout } from "./excel-generator-types";
import {
  transformRowValues,
  writeSheetHeader,
  skipEmptySheet,
} from "./excel-generator-helpers";

export class ExcelGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExcelGenerationError";
  }
}

export class ReportExcelTransformer extends Transform {
  private workbook: Excel.stream.xlsx.WorkbookWriter;
  private sheetLayouts: ReportSheetLayout[];
  private currentWorksheet: Excel.Worksheet | undefined;

  constructor(workbookConfig: ExcelReportConfig) {
    super({
      writableObjectMode: true,
      readableObjectMode: false,
    });

    const stream = new PassThrough({ objectMode: true });

    const config: Partial<Excel.stream.xlsx.WorkbookStreamWriterOptions> = {
      useStyles: true,
      useSharedStrings: true,
    };

    if (workbookConfig.filePath) {
      config.filename = workbookConfig.filePath;
    } else {
      config.stream = stream;

      stream.on("data", (chunk) => {
        this.push(chunk);
      });

      stream.on("end", () => {
        this.push(null);
      });
    }

    this.workbook = new Excel.stream.xlsx.WorkbookWriter(config);
    this.sheetLayouts = workbookConfig.layoutConfig;
  }

  createNewWorksheet(
    sheetLayout: ReportSheetLayout,
    rowData: {}
  ): Excel.Worksheet {
    if (this.currentWorksheet) {
      this.currentWorksheet.commit();
    }

    const worksheet = this.workbook.addWorksheet(
      sheetLayout.sheetName,
      sheetLayout.freeze
    );

    const worksheetWithHeader = writeSheetHeader(
      worksheet,
      rowData,
      sheetLayout
    );

    return worksheetWithHeader;
  }

  writeDataToSheet(worksheet: Excel.Worksheet, rowData: any) {
    const values = Object.values(rowData);
    const transformedRowValues = transformRowValues(values);
    worksheet.addRow(transformedRowValues).commit();
  }

  findWorksheet(sheetName: string, rowData: {}): Excel.Worksheet {
    if (!this.currentWorksheet || this.currentWorksheet.name !== sheetName) {
      const sheetLayout = this.getSheetLayout(sheetName);
      this.currentWorksheet = this.createNewWorksheet(sheetLayout, rowData);
      console.log("Generating sheet: ", sheetName);
    }
    return this.currentWorksheet;
  }

  getSheetLayout(sheetName: string): ReportSheetLayout {
    const sheetLayout = this.sheetLayouts.find(
      (sheetLayout) => sheetLayout.sheetName === sheetName
    );
    if (!sheetLayout) {
      throw new ExcelGenerationError(
        `Sheet layout not found for sheet: ${sheetName}`
      );
    }
    return sheetLayout;
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    try {
      const { recordsetName, rowData } = chunk;
      const sheetName = recordsetName;
      if (skipEmptySheet(rowData)) {
        callback(null);
        return;
      }
      const worksheet = this.findWorksheet(sheetName, rowData);
      this.writeDataToSheet(worksheet, rowData);
      callback(null);
    } catch (error: any) {
      callback(error);
    }
  }

  async _flush(callback: TransformCallback): Promise<void> {
    try {
      this.currentWorksheet?.commit();
      await this.workbook.commit();
      callback(null);
    } catch (error: any) {
      callback(error);
    }
  }
}
