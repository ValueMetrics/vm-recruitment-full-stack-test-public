import express from "express";
import valuationsRouter from "./routers/valuations-router";
import dataReportRouter from "./routers/data-report-router";
import cors from "cors";

const app = express();

app.use(cors());

app.use(valuationsRouter);
app.use(dataReportRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
