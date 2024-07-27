import { verify, ProfileType } from "./auth";
import {
  onCreateList,
  onGetLists,
  onDeleteList,
  onCreateMember,
  onGetMembers,
  onDeleteMember,
  onGetItems,
  onUpdateItems,
} from "./controllers";
import { Request, apiHandler } from "./api";

async function onListsRequest(event: Request): Promise<any> {
  const token = event.headers.Authorization.split(" ").pop() || "";
  const user: ProfileType = await verify(token);
  if (event.httpMethod === "POST") return await onCreateList(event, user);
  return await onGetLists(event, user);
}

async function onListRequest(event: Request): Promise<any> {
  const token = event.headers.Authorization.split(" ").pop() || "";
  const user: ProfileType = await verify(token);
  if (event.httpMethod === "DELETE") return await onDeleteList(event, user);
  return {};
}

async function onMembersRequest(event: Request): Promise<any> {
  const token = event.headers.Authorization.split(" ").pop() || "";
  const user: ProfileType = await verify(token);
  return await onGetMembers(event, user);
}

async function onMemberRequest(event: Request): Promise<any> {
  const token = event.headers.Authorization.split(" ").pop() || "";
  const user: ProfileType = await verify(token);
  if (event.httpMethod === "POST") return await onCreateMember(event, user);
  if (event.httpMethod === "DELETE") return await onDeleteMember(event, user);
  return {};
}

async function onItemsRequest(event: Request): Promise<any> {
  const token = event.headers.Authorization.split(" ").pop() || "";
  const user: ProfileType = await verify(token);
  if (event.httpMethod === "PUT") return await onUpdateItems(event, user);
  return await onGetItems(event, user);
}

export const allListsHandler = async (request: Request) =>
  await apiHandler({ request, onSync: onListsRequest });
export const oneListHandler = async (request: Request) =>
  await apiHandler({ request, onSync: onListRequest });
export const allMembersHandler = async (request: Request) =>
  await apiHandler({ request, onSync: onMembersRequest });
export const oneMemberHandler = async (request: Request) =>
  await apiHandler({ request, onSync: onMemberRequest });
export const allItemsHandler = async (request: Request) =>
  await apiHandler({ request, onSync: onItemsRequest });
