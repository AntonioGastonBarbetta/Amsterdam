import AWS from "aws-sdk";

const lambda = new AWS.Lambda();

// https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-runtime
export const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_EXECUTION_ENV = process.env.AWS_EXECUTION_ENV;
export const AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;
export const AWS_LAMBDA_FUNCTION_MEMORY_SIZE =
  process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE;
export const AWS_LAMBDA_FUNCTION_VERSION =
  process.env.AWS_LAMBDA_FUNCTION_VERSION;
export const AWS_LAMBDA_INITIALIZATION_TYPE =
  process.env.AWS_LAMBDA_INITIALIZATION_TYPE;
export const AWS_LAMBDA_LOG_GROUP_NAME = process.env.AWS_LAMBDA_LOG_GROUP_NAME;
export const AWS_LAMBDA_LOG_STREAM_NAME =
  process.env.AWS_LAMBDA_LOG_STREAM_NAME;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;
export const AWS_LAMBDA_RUNTIME_API = process.env.AWS_LAMBDA_RUNTIME_API;
export const LAMBDA_TASK_ROOT = process.env.LAMBDA_TASK_ROOT;
export const LAMBDA_RUNTIME_DIR = process.env.LAMBDA_RUNTIME_DIR;

const Type = {
  SYNC: "sync",
  ASYNC: "async",
};

export type Request = {
  httpMethod: string;
  type?: string;
  headers: {
    Authorization: string;
  };
  body: string;
  pathParameters?: { [key: string]: string | undefined };
};

export type Response = {
  statusCode: number;
  body: string;
  headers: {
    "Content-Type": string;
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
  };
};

export const asyncCall = async (name: string, payload: any) => {
  console.log(`API Async Invoke Request: ${name}: ${JSON.stringify(payload)}`);
  const response = await lambda
    .invoke({
      FunctionName: name,
      InvocationType: "Event",
      Payload: JSON.stringify({
        type: Type.ASYNC,
        body: JSON.stringify(payload),
      }),
    })
    .promise();
  console.log(`API Async Invoke Response: ${JSON.stringify(response)}`);
};

export const syncCall = async (name: string, payload: any): Promise<any> => {
  console.log(`API Sync Invoke Request: ${name}: ${JSON.stringify(payload)}`);
  const response = await lambda
    .invoke({
      FunctionName: name,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        type: Type.SYNC,
        body: JSON.stringify(payload),
      }),
    })
    .promise();
  console.log(`API Sync Invoke Response: ${JSON.stringify(response)}`);
  if (!response.Payload) throw new Error("No response payload");
  const parsedResponse = JSON.parse(response.Payload.toString()) as Response;
  if (parsedResponse.statusCode !== 200)
    throw new Error(`Error from Lambda: ${parsedResponse.body}`);
  return JSON.parse(parsedResponse.body);
};

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class BadUserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, BadUserInputError.prototype);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export const getResponse = (data: any = {}, code: number = 200): Response => {
  console.log(`API Response: ${code} - ${JSON.stringify(data)}`);
  return {
    statusCode: code,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PUT,PATCH,HEAD",
      "Access-Control-Allow-Headers": "Authorization,Content-Type",
    },
  };
};

type ApiHandlerParams = {
  request: Request;
  onSync: (request: Request) => Promise<Response>;
  onAsync?: (request: Request) => Promise<void>;
};

export const apiHandler = async (
  params: ApiHandlerParams,
): Promise<Response> => {
  console.log(`API Request: ${JSON.stringify(params.request)}`);
  if (params.request.httpMethod === "OPTIONS") return getResponse();
  try {
    if (params.request.type === Type.ASYNC && params.onAsync) {
      console.log(`API Async Request: ${params.request.body}`);
      const response = await params.onAsync(params.request);
      console.log(`API Async Response: ${JSON.stringify(response)}`);
      return getResponse(response);
    }
    return getResponse(await params.onSync(params.request));
  } catch (error) {
    console.error(`API Error: ${JSON.stringify(error)}`);
    if (error instanceof AuthenticationError) return getResponse({}, 401);
    if (error instanceof AuthorizationError) return getResponse({}, 403);
    if (error instanceof BadUserInputError) return getResponse({}, 400);
    if (error instanceof NotFoundError) return getResponse({}, 404);
    throw error;
  }
};
