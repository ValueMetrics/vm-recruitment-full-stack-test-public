import Excel from "exceljs";
import path from "path";
import {
  ColumnDefinitions,
  ExcelReportConfig,
  ReportColumnLayout,
  ReportSheetFreezeConfig,
  ReportSheetLayout,
  WorksheetDefinitions,
} from "./excel-generator.types";
import { Recordset } from "../mssql-recordset-streaming/mssql-recordset-streaming.types";
import {
  MILLISECONDS_IN_MINUTE,
  REPORT_DEFAULT_COLUMN_WIDTH,
  REPORT_DEFAULT_FONT_CONFIG,
  REPORT_HEADER_FONT_CONFIG,
  REPORT_STORAGE_DIRNAME,
} from "./excel-generator.constants";
import DateCurrent from "../../utils/dateCurrent";

export function extractFilenameFromFilePath(filePath: string): string {
  const filePathParts = filePath.split("/");
  return filePathParts[filePathParts.length - 1];
}

export function transformRowValues(rowValues: any[]): unknown[] {
  const transformedRowValues: unknown[] = [];
  rowValues.forEach((rowValue: any) => {
    if (rowValue instanceof Date) {
      transformedRowValues.push(transformDateToLocalTimezone(rowValue));
    } else {
      transformedRowValues.push(rowValue);
    }
  });

  return transformedRowValues as unknown[];
}

export function writeSheetHeader(
  worksheet: Excel.Worksheet,
  row: {},
  sheetLayout: ReportSheetLayout,
): Excel.Worksheet {
  worksheet.columns = Object.keys(row).map((column) => {
    const currentColumn: ReportColumnLayout = sheetLayout.columns.find(
      (columnLayout) => columnLayout.column === column,
    ) as ReportColumnLayout;
    return {
      header: currentColumn?.columnDisplayName || column,
      width: currentColumn?.width || REPORT_DEFAULT_COLUMN_WIDTH,
      font: REPORT_DEFAULT_FONT_CONFIG,
      style: currentColumn?.style,
    };
  }) as Excel.Column[];

  const worksheetWithHeader = createStyledWorksheetHeader(worksheet);

  return worksheetWithHeader;
}

function transformDateToLocalTimezone(date: Date): Date {
  const offset = date.getTimezoneOffset();
  const localTime = date.getTime() - offset * MILLISECONDS_IN_MINUTE;
  return new Date(localTime);
}

function columnToLetter(column: number): string {
  let temp: number;
  let letter = "";
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function createStyledWorksheetHeader(
  worksheet: Excel.Worksheet,
): Excel.Worksheet {
  Object.keys(worksheet.getRow(1).values).forEach((column, index) => {
    worksheet.getCell(`${columnToLetter(index + 1)}1`).font =
      REPORT_HEADER_FONT_CONFIG;
  });
  return worksheet;
}

function getSheetFreezeConfig(
  sheet: WorksheetDefinitions,
): ReportSheetFreezeConfig | undefined {
  if (sheet.xSplit || sheet.ySplit) {
    return {
      views: [{ state: "frozen", xSplit: sheet.xSplit, ySplit: sheet.ySplit }],
    };
  } else {
    return undefined;
  }
}

function formatLayoutConfig(
  columnLayout: ColumnDefinitions[],
  worksheets: WorksheetDefinitions[],
): ReportSheetLayout[] {
  // Reformat column definitions to report layout with config per sheet
  const reportLayout = columnLayout.reduce(
    (acc: ReportSheetLayout[], curr: ColumnDefinitions) => {
      const sheet = acc.find(
        (sheet: ReportSheetLayout) => sheet.sheetName === curr.sheet,
      );
      if (!sheet) {
        acc.push({
          recordSet: {
            name: curr.sheet,
          },
          sheetName: curr.sheet,
          columns: [
            {
              column: curr.column_name,
              columnDisplayName: curr.column_name_friendly,
              width: curr.width,
              style: {
                numFmt: curr.format,
              },
            },
          ],
        });
      } else {
        sheet.columns.push({
          column: curr.column_name,
          columnDisplayName: curr.column_name_friendly,
          width: curr.width,
          style: {
            numFmt: curr.format,
          },
        });
      }
      return acc;
    },
    [],
  );

  // Reduce report layout to sheets that are present in the data
  return worksheets.map((sheet: WorksheetDefinitions) => {
    const sheetLayout = reportLayout.find(
      (layout) => layout.sheetName === sheet.tabbladen,
    );
    return {
      ...sheetLayout,
      freeze: getSheetFreezeConfig(sheet),
    } as ReportSheetLayout;
  });
}

function createReportFilePath(baseName: string): string {
  const filename = `${DateCurrent.getDateCurrentShort()}_${baseName}`;
  const filenameWithExtension = `${filename}.xlsx`;

  // Resolve path from string
  return path.resolve(`${REPORT_STORAGE_DIRNAME}/${filenameWithExtension}`);
}

export function getExcelReportConfig(
  reportBaseName: string,
  reportWorksheets: WorksheetDefinitions[],
  reportColumnDefinitions: ColumnDefinitions[],
): ExcelReportConfig {
  const filePath = createReportFilePath(reportBaseName);
  const layoutConfig = formatLayoutConfig(
    reportColumnDefinitions,
    reportWorksheets,
  );

  return {
    filePath,
    layoutConfig,
  };
}

export function formatRecordsetsFromLayoutConfig(
  layoutConfig: ReportSheetLayout[],
): Recordset[] {
  return layoutConfig.map((sheetLayout) => {
    return { name: sheetLayout.sheetName };
  });
}
