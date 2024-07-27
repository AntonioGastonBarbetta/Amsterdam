import { ProfileType } from "./auth";
import { load, save, getKey, Store } from "./data";
import { List, Lists, Items } from "./models";
import { v4 as uuidv4 } from "uuid";
import { BadUserInputError, Request } from "./api";
import {
  isUserMember,
  getListById,
  getMembersByListId,
  addUserToExistingList,
  removeUserFromList,
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
  await save<List>(
    getKey({
      store: Store.LIST,
    }),
    list,
  );
  await addUserToExistingList(user.email, list);
  return list;
}

export async function onGetLists(
  event: Request,
  user: ProfileType,
): Promise<any> {
  return await load<Lists>(
    getKey({
      email: user.email,
      store: Store.LISTS,
    }),
  );
}

export async function onDeleteList(
  event: Request,
  user: ProfileType,
): Promise<any> {
  const list = await getListById(event.pathParameters?.id);
  await isUserMember(list.id, user);
  const members = await getMembersByListId(list.id);
  for (const member of members.members) {
    await removeUserFromList(list.id, member.email);
  }
  return await load<Lists>(
    getKey({
      email: user.email,
      store: Store.LISTS,
    }),
  );
}

export async function onCreateMember(
  event: Request,
  user: ProfileType,
): Promise<any> {
  const body = JSON.parse(event.body);
  const listId = event.pathParameters?.id;
  const email = body.email;
  if (!email) throw new BadUserInputError("Email is required!");
  const list = await getListById(listId);
  await isUserMember(list.id, user);
  return await addUserToExistingList(email, list);
}

export async function onGetMembers(
  event: Request,
  user: ProfileType,
): Promise<any> {
  const listId = event.pathParameters?.id;
  await isUserMember(listId, user);
  return await getMembersByListId(listId);
}

export async function onDeleteMember(
  event: Request,
  user: ProfileType,
): Promise<any> {
  const listId = event.pathParameters?.id;
  const email = event.pathParameters?.email;
  const list = await getListById(listId);
  await isUserMember(list.id, user);
  return await removeUserFromList(listId, email);
}

export async function onGetItems(
  event: Request,
  user: ProfileType,
): Promise<any> {
  const listId = event.pathParameters?.id;
  const list = await getListById(listId);
  await isUserMember(list.id, user);
  return await load<Items>(
    getKey({
      store: Store.ITEMS,
      name: listId,
    }),
  );
}

export async function onUpdateItems(
  event: Request,
  user: ProfileType,
): Promise<any> {
  const listId = event.pathParameters?.id;
  const list = await getListById(listId);
  await isUserMember(list.id, user);
  const body = JSON.parse(event.body);
  const items = body.items;
  await save<Items>(
    getKey({
      store: Store.ITEMS,
      name: listId,
    }),
    { items },
  );
}
