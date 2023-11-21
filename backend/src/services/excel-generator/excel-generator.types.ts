export interface ExcelReportConfig {
  filePath?: string;
  layoutConfig: ReportSheetLayout[];
}

export interface ReportSheetLayout {
  recordSet: {
    name: string;
  };
  sheetName: string;
  freeze?: ReportSheetFreezeConfig;
  columns: ReportColumnLayout[];
}

export interface ReportColumnLayout {
  column: string;
  columnDisplayName: string;
  width: number;
  style: {
    numFmt: string;
  };
}

export interface ReportSheetFreezeConfig {
  views: [
    {
      state: "frozen";
      xSplit: number;
      ySplit: number;
    }
  ];
}

export interface WorksheetDefinitions {
  tabbladen: string;
  xSplit: number;
  ySplit: number;
}

export interface ColumnDefinitions {
  sheet: string;
  column_name: string;
  column_name_friendly: string;
  width: number;
  format: string;
}

export interface WorksheetDefinitions {
  tabbladen: string;
  xSplit: number;
  ySplit: number;
}
