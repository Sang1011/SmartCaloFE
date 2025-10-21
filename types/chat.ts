export type CreateChatStreamBodyRequest = {
  userId: string;
  question: string;
}

export type GetAllMessageResponse = {
  pageIndex: 0;
  pageSize: 0;
  count: 0;
  data: MessageDTO[];
}

export type MessageDTO = {
  id: string;
  question: string;
  answer: string;
}

export type GetAllChatSessionResponse = {
  pageIndex: 0;
  pageSize: 0;
  count: 0;
  data: SessionDTO[];
}

export type SessionDTO = {
  id: string;
  title: string;
}