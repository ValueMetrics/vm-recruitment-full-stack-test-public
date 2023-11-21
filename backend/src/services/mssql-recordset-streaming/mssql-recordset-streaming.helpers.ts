function dataRowIsEmpty(row: {}): boolean {
  return (
    Object.values(row).every((value) => value === null) &&
    Object.keys(row).every((key) => key === "Kolom")
  );
}

function columnsToFingerprint(columns: string[]): string {
  return columns.join(",").toLowerCase();
}

function generateRandomFingerprint(): string {
  return Math.random().toString(36).substring(7);
}

export function createFingerprintFromRowdata(rowData: {}): string {
  if (dataRowIsEmpty(rowData)) {
    return generateRandomFingerprint();
  }
  const columns = Object.keys(rowData);
  return columnsToFingerprint(columns);
}
