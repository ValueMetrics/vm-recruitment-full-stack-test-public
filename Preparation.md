# ValueMetrics Full-Stack Recruitment Case - Preparation
## Introduction
Here at ValueMetrics, we work a lot with real-estate data. Clients upload their data using our upload tools and are subsequently able to inspect their data using our dashboards and data reports.

This repository will be the basis for the recruitment case. It consists of a Vue 3 frontend with Pinia stores. You can already familiarize yourself with the stores and their functions. Together with the Pinia documentation, you should be able to understand what kind of business logic we have implemented there.

The backend is a Node.js application and uses Express as routing solution. It holds three services: the excel-generator service, the mssql-recordset-streaming service, and the mssql-database connection service.

The mssql-database-connection service is responsible for connecting the backend to the MSSQL database. The mssql-recordset-streaming service is responsible for transforming datastreams from the database, so they can work with the excel generator. Finally, the excel-generatir service holds the logic that enables the creation of excel files from the datastreams generated by the mssql-recordset-streaming service. In this document, we will explain how an excel file is generated using this backend in more detail.

## Technical background
To generate a report, [the layout configuration](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/controllers/data-report-controller.ts#L46), [the expected worksheets](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/controllers/data-report-controller.ts#L55) (for some clients the report contains different sheets compared to others) and [the report data](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/817a56578c9688eec2d61dd16055aec486a11633/backend/src/controllers/data-report-controller.ts#L69C5-L69C5) is requested from the database. From these three pieces of information, the report is generated.

First, a [formatted layout configuration is generated](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/excel-generator/excel-generator.ts#L26) from the worksheets and the layout configuration from the database. The data that fills the report is [retrieved from the database in a node Readable stream](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/mssql-database-connection/stored-procedures.ts#L28). This Readable stream returns the report data row by row, in order of the sheets of the report. 

To identify which row belongs to what sheet, a recordsetId row is returned by the Readable stream. All rows that come after the recordsetId row belong to that recordset, and therefore belong to a specific sheet in the report. [A recordsetId row inside the data stream has a single column “recordsetName”, which holds the id of the recordset](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/mssql-recordset-streaming/mssql-recordset-streaming-transformer.ts#L10). 

The first transformer ([MSSQLRowTransformer](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/mssql-recordset-streaming/mssql-recordset-streaming-transformer.ts#L15)) handles the data stream. With every incoming row, it [checks if the row holds the recordsetId](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/mssql-recordset-streaming/mssql-recordset-streaming-transformer.ts#L27). If found, [the recordsetId is stored](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/mssql-recordset-streaming/mssql-recordset-streaming-transformer.ts#L28), and [passed along with the data rows to the next transformer](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/mssql-recordset-streaming/mssql-recordset-streaming-transformer.ts#L40) in the pipeline until it finds a new recordsetId. Therefore, if a recordsetId changes, the Readable stream is said to return data of a new recordset, which defines a new Excel worksheet in the report.

The final transformer ([ReportExcelTransformer](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/excel-generator/excel-generator-transformer.ts#L18C6-L18C6)) takes [the formatted layout configuration and output file path as input](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/excel-generator/excel-generator.ts#L38) and processes the incoming data row into an Excel file. For every row, the recordsetId is used to find the correct sheet to commit the data to. If it is the first row of a new sheet, [a new worksheet is generated using the correct layout configuration](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/excel-generator/excel-generator-transformer.ts#L85), and the data is committed to this sheet. If the first row of a new sheet does not contain data, [the sheet is empty](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/excel-generator/excel-generator-helpers.ts#L178), and therefore [the creation of this sheet is skipped](https://github.com/ValueMetrics/vm-recruitment-full-stack-test-public/blob/main/backend/src/services/excel-generator/excel-generator-transformer.ts#L112). When all the data and sheets are processed and generated, the workbook is stored on the specified location if a file path is configured as input to this transformer. If this file path is not used as input to the transformer, the transformer will pipe the chunks through the stream.

## Useful documentation

- [Vue3](https://vuejs.org)
- [Pinia](https://pinia.vuejs.org)
- [TailwindCSS](https://tailwindcss.com)
- [Node](https://nodejs.org)
- [Express](https://expressjs.com)
- [Node Streams](https://nodejs.org/api/stream.html)
- [ExcelJS](https://github.com/exceljs/exceljs)
- [Node-MSSQL](https://github.com/tediousjs/node-mssql)

\
\
**Happy coding and good luck!**
