export type List = {
  id: string;
  name: string;
  createdAt: string;
};

export type Item = {
  text: string;
};

export type Member = {
  email: string;
};

export type Lists = {
  lists: List[];
};

export type Members = {
  members: Member[];
};

export type Items = {
  items: Item[];
};
