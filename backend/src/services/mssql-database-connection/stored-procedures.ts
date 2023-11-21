import { ConnectionPool, Request, VarChar, IResult } from "mssql";
import {
  InputParameterConfig,
  OutputParameterConfig,
  PreparedStatementInput,
  PreparedStatementOutput,
} from "./mssql.types";
import { Readable } from "stream";

async function createStoredProcedureRequest(
  pool: ConnectionPool,
  params?: PreparedStatementInput[],
  output?: PreparedStatementOutput[]
): Promise<Request> {
  const request = new Request(pool);

  params?.forEach((param) => {
    request.input(param.name, param.type, param.value);
  });

  output?.forEach((outputParam) => {
    request.output(outputParam.name, outputParam.type);
  });

  return request;
}

export async function executeStoredProcedureReturnStream(
  pool: ConnectionPool,
  query: string,
  params?: PreparedStatementInput[],
  output?: PreparedStatementOutput[]
): Promise<Readable> {
  const request = await createStoredProcedureRequest(pool, params, output);
  const readableStream = request.toReadableStream();

  request.query(query);

  return readableStream;
}

export async function executeStoredProcedure(
  pool: ConnectionPool,
  query: string,
  params?: PreparedStatementInput[],
  output?: PreparedStatementOutput[]
): Promise<IResult<any>> {
  const request = await createStoredProcedureRequest(pool, params, output);

  const result = await request.query(query);

  return result;
}

export function constructInputParams(
  params: InputParameterConfig[]
): PreparedStatementInput[] {
  const statementParams: PreparedStatementInput[] = [];

  params.forEach((param) => {
    statementParams.push({
      name: param.name,
      value: param.value,
      type: param.type || VarChar,
    });
  });

  return statementParams;
}

export function constructOutputParams(
  params: OutputParameterConfig[]
): PreparedStatementOutput[] {
  const statementParams: PreparedStatementOutput[] = [];

  params.forEach((param) => {
    statementParams.push({
      name: param.name,
      type: param.type || VarChar,
    });
  });

  return statementParams;
}
