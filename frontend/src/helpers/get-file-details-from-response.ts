import { AxiosResponse } from "axios";

export function getFileDetailsFromResponse(response: AxiosResponse): {
  filename: string;
  blob: Blob;
} {
  // Get content disposition header
  const contentDisposition = response.headers["content-disposition"];

  if (!contentDisposition) {
    throw new Error("Content disposition not found in response headers");
  }

  // Get filename from content disposition header
  const filename = contentDisposition.split("filename=")[1];

  if (!filename) {
    throw new Error("Filename not found in response headers");
  }

  // Get content type header to extract file extension
  const contentType = response.headers["content-type"];

  if (!contentType) {
    throw new Error("Content type not found in response headers");
  }

  // Create file blob
  const blob = new Blob([response.data], { type: contentType });

  return { filename, blob };
}
