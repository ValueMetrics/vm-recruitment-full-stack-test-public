import express from "express";
import { z } from "zod";
import {
  generateDataReport,
  DataReportParams,
} from "../controllers/datareport-controller";
import { booleanParamSchema } from "../utils/zodBooleanParamSchema";

const router = express.Router();

const dataReportSchema = z.object({
  clientId: z.any(),
  snapshotId: z.coerce.number(),
  versionId: z.coerce.number(),
  userId: z.string(),
  isValuator: booleanParamSchema,
  valuatorId: z.string().nullable().default(null),
  reportId: z.string(),
  columnDefinitionsId: z.string(),
});

router.get("/data_report", async (req, res) => {
  try {
    // Validate params
    const validatedParams: DataReportParams = dataReportSchema.parse(req.query);

    // Generate report
    const { excelStream, filename } = await generateDataReport({
      ...validatedParams,
    });

    // Set headers
    res.header("Access-Control-Expose-Headers", "Content-Type");
    res.header("Content-Disposition", `attachment; filename=${filename}`);
    res.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    // Pipe stream to response
    excelStream.pipe(res);
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error || error instanceof z.ZodError) {
      res.status(400).send(error.message);
    }
  }
});

export default router;
