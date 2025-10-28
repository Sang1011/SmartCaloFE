import { apiClient } from "@services/apiClient";
import { CreateChatStreamBodyRequest } from "../../types/chat";
import { CHAT_URLS } from "./chatUrls";
export const chatApi = {
  getAllChatMessage: (
    sessionId: string,
    pageIndex: number,
    pageSize: number,
    orderBy: string,
    isAscending: boolean,
  ) => apiClient.get(CHAT_URLS.GET_ALL_MESSAGES + `?PageIndex=${pageIndex}&PageSize=${pageSize}&OrderBy=${orderBy}&IsAscending=${isAscending}&sessionId=${sessionId}`),
  getAllChatSession: (
    userId: string,
    pageIndex: number,
    pageSize: number,
    orderBy: string,
    isAscending: boolean,
  ) => apiClient.get(CHAT_URLS.GET_ALL_SESSIONS + `?PageIndex=${pageIndex}&PageSize=${pageSize}&OrderBy=${orderBy}&IsAscending=${isAscending}&userId=${userId}`),
  createMessage: (body: CreateChatStreamBodyRequest, sessionId?: string) => {
    const url = sessionId !== null && sessionId?.length !== 0 && sessionId !== undefined
      ? `${CHAT_URLS.SEND_CHAT}?sessionId=${sessionId}`
      : CHAT_URLS.SEND_CHAT;
      console.log("URL TO ________", url);
    return apiClient.post(url, body);
  }
};