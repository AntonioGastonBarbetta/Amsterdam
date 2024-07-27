import { ProfileType } from "./auth";
import { load, save, getKey, Store } from "./data";
import { List, Lists, Members, Items } from "./models";
import { BadUserInputError } from "./api";
import { AuthorizationError, NotFoundError } from "./api";

export const getItemsByListId = async (listId: string): Promise<Items> => {
  if (!listId) throw new BadUserInputError("List ID is required!");
  const items = await load<Items>(
    getKey({
      listId: listId,
      store: Store.ITEMS,
    }),
  );
  if (!items || !items.items) return { items: [] };
  return items;
};

export const isUserMember = async (
  listId: string,
  email: string,
): Promise<boolean> => {
  const members = await getMembersByListId(listId);
  return !!members.members.find((member) => member.email === email);
};

export const validateUserIsMember = async (
  listId: string,
  user: ProfileType,
): Promise<boolean> => {
  if (await isUserMember(listId, user.email)) return true;
  throw new AuthorizationError("User is not a member of this list!");
};

export const getListById = async (listId: string): Promise<List> => {
  if (!listId) throw new BadUserInputError("List ID is required!");
  const list = await load<List>(
    getKey({
      listId: listId,
      store: Store.DETAILS,
    }),
  );
  if (!list) throw new NotFoundError("List not found!");
  return list;
};

export const getMembersByListId = async (listId: string): Promise<Members> => {
  if (!listId) throw new BadUserInputError("List ID is required!");
  const members = await load<Members>(
    getKey({
      listId: listId,
      store: Store.MEMBERS,
    }),
  );
  if (!members || !members.members) return { members: [] };
  return members;
};

export const getListsByUser = async (email: string): Promise<Lists> => {
  if (!email) throw new BadUserInputError("Email is required!");
  const lists = await load<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
    }),
  );
  if (!lists || !lists.lists) return { lists: [] };
  return lists;
};

export const addMemberToList = async (
  email: string,
  list: List,
): Promise<Members> => {
  if (!(await isUserMember(list.id, email))) {
    const allLists = await getListsByUser(email);
    if (!allLists.lists.find((l) => l.id === list.id))
      allLists.lists.push(list);
    await setUserLists(email, allLists);
    const members = await getMembersByListId(list.id);
    members.members.push({ email: email });
    setListMembers(list.id, members);
  }
  return await getMembersByListId(list.id);
};

export const removeMemberFromList = async (
  listId: string,
  email: string,
): Promise<void> => {
  if (!email) throw new BadUserInputError("Email is required!");
  const allLists = await getListsByUser(email);
  allLists.lists = allLists.lists.filter((list) => list.id !== listId);
  await setUserLists(email, allLists);
  const members = await getMembersByListId(listId);
  members.members = members.members.filter((member) => member.email !== email);
  setListMembers(listId, members);
};

export const setListDetails = async (list: List): Promise<void> => {
  if (!list.id) throw new BadUserInputError("List ID is required!");
  await save<List>(
    getKey({
      listId: list.id,
      store: Store.DETAILS,
    }),
    list,
  );
  await save<List>(
    getKey({
      listId: list.id,
      store: Store.DETAILS,
      now: true,
    }),
    list,
  );
};

export const setListMembers = async (
  listId: string,
  members: Members,
): Promise<void> => {
  if (!listId) throw new BadUserInputError("List ID is required!");
  await save<Members>(
    getKey({
      listId: listId,
      store: Store.MEMBERS,
    }),
    members,
  );
  await save<Members>(
    getKey({
      listId: listId,
      store: Store.MEMBERS,
      now: true,
    }),
    members,
  );
};

export const setListItems = async (
  listId: string,
  items: Items,
): Promise<void> => {
  if (!listId) throw new BadUserInputError("List ID is required!");
  await save<Items>(
    getKey({
      listId: listId,
      store: Store.ITEMS,
    }),
    items,
  );
  await save<Items>(
    getKey({
      listId: listId,
      store: Store.ITEMS,
      now: true,
    }),
    items,
  );
};

export const setUserLists = async (
  email: string,
  lists: Lists,
): Promise<void> => {
  if (!email) throw new BadUserInputError("Email is required!");
  await save<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
    }),
    lists,
  );
  await save<Lists>(
    getKey({
      email: email,
      store: Store.LISTS,
      now: true,
    }),
    lists,
  );
};
