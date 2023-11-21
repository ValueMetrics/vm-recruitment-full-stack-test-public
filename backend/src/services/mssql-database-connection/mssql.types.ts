import sql from "mssql";

export interface PreparedStatementInput {
  name: string;
  type: (() => sql.ISqlType) | sql.ISqlType;
  value: unknown;
}

export interface PreparedStatementOutput {
  name: string;
  type: (() => sql.ISqlType) | sql.ISqlType;
}

export interface OutputParameterConfig {
  name: string;
  type?: (() => sql.ISqlType) | sql.ISqlType;
}

export interface InputParameterConfig extends OutputParameterConfig {
  value: unknown;
}
