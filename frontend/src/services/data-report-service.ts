import httpBackendClient from "@/api/http-client";
import { getFileDetailsFromResponse } from "@/helpers/get-file-details-from-response";

export interface DataReportParams {
  clientId: string;
  snapshotId: number;
  versionId: number;
  userId: string;
  isValuator: boolean;
  valuatorId: string | null;
  reportId: string;
  columnDefinitionsId: string;
}

export async function downloadValuationReport(
  dataReportParams: DataReportParams,
): Promise<{ filename: string; blob: Blob }> {
  const response = await httpBackendClient.get("/data_report", {
    params: dataReportParams,
    responseType: "blob",
  });

  const { filename, blob } = getFileDetailsFromResponse(response);
  return { filename, blob };
}
