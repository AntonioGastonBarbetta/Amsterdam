import { ProfileType } from "./auth";
import { load, save, getKey, Store } from "./data";
import { Item, List, Member, Lists, Members, Items } from "./models";
import { BadUserInputError, Request } from "./api";
import { AuthorizationError, NotFoundError } from "./api";

export const isUserMember = async (
  listId: string,
  user: ProfileType,
): Promise<boolean> => {
  const members = await load<Members>(
    getKey({
      store: Store.MEMBERS,
      name: listId,
    }),
  );
  if (members.members.find((member) => member.email === user.email))
    return true;
  throw new AuthorizationError("User is not a member of this list!");
};

export const getListById = async (listId: string): Promise<List> => {
  if (!listId) throw new BadUserInputError("List ID is required!");
  const list = await load<List>(
    getKey({
      store: Store.LIST,
      name: listId,
    }),
  );
  if (!list) throw new NotFoundError("List not found!");
  return list;
};

export const getMembersByListId = async (listId: string): Promise<Members> => {
  if (!listId) throw new BadUserInputError("List ID is required!");
  return await load<Members>(
    getKey({
      store: Store.MEMBERS,
      name: listId,
    }),
  );
};

export const addUserToExistingList = async (
  email: string,
  list: List,
): Promise<Members> => {
  if (!email) throw new BadUserInputError("Email is required!");
  const allLists = await load<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
    }),
  );
  allLists.lists.push(list);
  await save<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
      now: true,
    }),
    allLists,
  );
  await save<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
    }),
    allLists,
  );
  await save<Members>(
    getKey({
      store: Store.MEMBERS,
    }),
    { members: [{ email: email }] },
  );
  return await load<Members>(
    getKey({
      store: Store.MEMBERS,
    }),
  );
};

export const removeUserFromList = async (
  listId: string,
  email: string,
): Promise<void> => {
  if (!email) throw new BadUserInputError("Email is required!");
  const allLists = await load<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
    }),
  );
  allLists.lists = allLists.lists.filter((list) => list.id !== listId);
  await save<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
      now: true,
    }),
    allLists,
  );
  await save<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
    }),
    allLists,
  );
  const members = await load<Members>(
    getKey({
      store: Store.MEMBERS,
      name: listId,
    }),
  );
  members.members = members.members.filter((member) => member.email !== email);
  await save<Members>(
    getKey({
      store: Store.MEMBERS,
      name: listId,
    }),
    members,
  );
};
