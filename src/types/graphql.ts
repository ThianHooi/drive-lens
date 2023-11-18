export type GraphqlError = {
  message: string;
  locations: {
    line: number;
    column: number;
  }[];
  path: string[];
  extensions: {
    code: string;
  };
};

export type GraphqlErrors = GraphqlError[];

export type GraphqlErrorResponse = {
  response: {
    errors: GraphqlErrors;
  };
};
