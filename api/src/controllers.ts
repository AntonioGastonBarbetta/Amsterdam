import { ProfileType } from "./auth";
import { load, getKey, Store } from "./data";
import { Items, Members, Lists } from "./models";
import { v4 as uuidv4 } from "uuid";
import { BadUserInputError, Request } from "./api";
import {
  validateUserIsMember,
  getListById,
  getListsByUser,
  setListDetails,
  getMembersByListId,
  addMemberToList,
  getItemsByListId,
  setListItems,
  removeMemberFromList,
} from "./utils";

export async function onCreateList(
  event: Request,
  user: ProfileType,
): Promise<any> {
  const body = JSON.parse(event.body);
  if (!body.name) throw new BadUserInputError("List name is required!");
  const list = {
    id: uuidv4(),
    name: body.name,
    owner: user.email,
    createdAt: new Date().toISOString(),
  };
  await setListDetails(list);
  await addMemberToList(user.email, list);
  return list;
}

export async function onGetLists(
  event: Request,
  user: ProfileType,
): Promise<Lists> {
  return await getListsByUser(user.email);
}

export async function onDeleteList(
  event: Request,
  user: ProfileType,
): Promise<any> {
  const list = await getListById(event.pathParameters?.listId);
  await validateUserIsMember(list.id, user);
  const members = await getMembersByListId(list.id);
  for (const member of members.members) {
    await removeMemberFromList(list.id, member.email);
  }
  return {};
}

export async function onCreateMember(
  event: Request,
  user: ProfileType,
): Promise<Members> {
  const listId = event.pathParameters?.listId;
  const email = event.pathParameters?.userId;
  const list = await getListById(listId);
  await validateUserIsMember(listId, user);
  return await addMemberToList(email, list);
}

export async function onGetMembers(
  event: Request,
  user: ProfileType,
): Promise<Members> {
  const listId = event.pathParameters?.listId;
  await validateUserIsMember(listId, user);
  return await getMembersByListId(listId);
}

export async function onDeleteMember(
  event: Request,
  user: ProfileType,
): Promise<Members> {
  const listId = event.pathParameters?.listId;
  const email = event.pathParameters?.userId;
  const list = await getListById(listId);
  await validateUserIsMember(list.id, user);
  await removeMemberFromList(listId, email);
  return await getMembersByListId(listId);
}

export async function onGetItems(
  event: Request,
  user: ProfileType,
): Promise<Items> {
  const listId = event.pathParameters?.listId;
  const list = await getListById(listId);
  await validateUserIsMember(list.id, user);
  return await getItemsByListId(list.id);
}

export async function onUpdateItems(
  event: Request,
  user: ProfileType,
): Promise<Items> {
  const listId = event.pathParameters?.listId;
  const list = await getListById(listId);
  await validateUserIsMember(list.id, user);
  const body = JSON.parse(event.body);
  const items = body.items;
  await setListItems(list.id, { items: items });
  return await getItemsByListId(list.id);
}
