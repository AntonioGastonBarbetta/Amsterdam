import aws from "aws-sdk";
import { AuthorizationError } from "./api";

const s3 = new aws.S3();

const BUCKET_NAME = process.env.BUCKET_NAME;

export const Scope = {
  USERS: "users",
  SYSTEM: "system",
  LISTS: "lists",
};

export const Store = {
  LISTS: "lists",
  LIST: "list",
  MEMBERS: "members",
  DETAILS: "details",
  ITEMS: "items",
};

const LATEST = "_latest";

type Key = {
  email?: string;
  listId?: string;
  store: string;
  name?: string;
  today?: boolean;
  now?: boolean;
};

export const getKey = (key: Key): string => {
  if (key.today) key.name = new Date().toISOString().split("T")[0];
  if (key.now) key.name = new Date().toISOString();
  if (key.listId)
    return `${Scope.LISTS}/${key.listId}/${key.store}/${key.name || LATEST}.json`;
  if (key.email)
    return `${Scope.USERS}/${key.email}/${key.store}/${key.name || LATEST}.json`;
  return `${Scope.SYSTEM}/${key.store}/${key.name || LATEST}.json`;
};

export async function save<T>(path: string, data: T): Promise<void> {
  console.log(`S3 File Save: ${path} - ${JSON.stringify(data)}`);
  const existingData: T = await load<T>(path);
  if (JSON.stringify(existingData) === JSON.stringify(data)) {
    console.log(`S3 File No change: ${path}`);
    return;
  }
  await s3
    .putObject({
      Bucket: BUCKET_NAME,
      Key: path,
      Body: JSON.stringify({
        ...existingData,
        ...data,
      }),
      ContentType: "application/json",
    })
    .promise();
}

export async function exists(path: string): Promise<boolean> {
  console.log(`S3 File Head: ${path}`);
  try {
    await s3
      .headObject({
        Bucket: BUCKET_NAME,
        Key: path,
      })
      .promise();
    console.log(`S3 File Exists: ${path}`);
    return true;
  } catch (error) {
    console.log(`Error: ${JSON.stringify(error)}`);
    if (error.code === "Forbidden")
      throw new AuthorizationError("Access Forbidden!");
    if (error.code === "NotFound") {
      console.log(`S3 File Not Found: ${path}`);
      return false;
    }
    throw error;
  }
}

export async function load<T>(path: string): Promise<T> {
  console.log(`S3 File Load: ${path}`);
  if (!(await exists(path))) {
    return {} as T;
  }
  const data: any = await s3
    .getObject({
      Bucket: BUCKET_NAME,
      Key: path,
    })
    .promise();
  const body = data.Body.toString("utf-8");
  console.log(`S3 File Loaded: ${path}: ${body}`);
  return JSON.parse(body) as T;
}
