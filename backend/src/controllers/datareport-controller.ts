import { Bit, Int, SmallInt } from "mssql";
import {
  constructInputParams,
  executeStoredProcedure,
  executeStoredProcedureReturnStream,
} from "../services/mssql-database-connection/stored-procedures";
import { createMSSQLConnection } from "../services/mssql-database-connection/create-mssql-connection";
import {
  GenerateExcelReportOutput,
  generateExcelReport,
} from "../services/excel-generator/excel-generator.controller";

export interface DataReportParams {
  clientId?: string;
  snapshotId: number;
  versionId: number;
  userId: string;
  isValuator: boolean;
  valuatorId: string | null;
  reportId: string;
  columnDefinitionsId: string;
}

export async function generateDataReport(
  dataReportParams: DataReportParams,
): Promise<GenerateExcelReportOutput> {
  const {
    clientId,
    snapshotId,
    versionId,
    userId,
    isValuator,
    valuatorId,
    reportId,
    columnDefinitionsId,
  } = dataReportParams;
  console.info("Generating valuation report with params:", dataReportParams);

  const connection = await createMSSQLConnection();

  // Get column defs
  const paramsColumns = constructInputParams([
    { name: "reportId", value: reportId },
  ]);
  const qColumns = `EXEC [LWI_Result_${clientId}].[dbo].[p_get_columns_generate_report] @ReportName = @reportId`;
  const columns = (
    await executeStoredProcedure(connection, qColumns, paramsColumns)
  ).recordset;

  // Get worksheets
  const paramsWorksheets = constructInputParams([
    { name: "columnDefinitionsId", value: columnDefinitionsId },
  ]);
  const qWorksheets = `EXEC [LWI_Result_${clientId}].[dbo].[p_get_worksheets_generate_report] @ReportType = @columnDefinitionsId`;
  const worksheets = (
    await executeStoredProcedure(connection, qWorksheets, paramsWorksheets)
  ).recordset;

  // Get stream
  const paramsStream = constructInputParams([
    { name: "clientId", value: clientId },
    { name: "snapshotId", value: snapshotId, type: Int },
    { name: "versionId", value: versionId, type: SmallInt },
    { name: "userId", value: userId },
    { name: "isValuator", value: isValuator, type: Bit },
    { name: "valuatorId", value: valuatorId },
  ]);
  const qStream = `[LWI_Result_${clientId}].[dbo].[p_generate_valuation_report] @Klant = @clientId, @Snapshot = @snapshotId, @Versie = @versionId, @Gebruiker = @userId, @isTaxateur = @isValuator, @Taxateur = @valuatorId`;
  const readableStream = await executeStoredProcedureReturnStream(
    connection,
    qStream,
    paramsStream,
    undefined,
  );

  // Generate excel
  const { excelStream, filename } = await generateExcelReport(
    reportId,
    worksheets,
    columns,
    readableStream,
  );

  return { excelStream, filename };
}
