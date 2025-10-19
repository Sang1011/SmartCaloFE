import apiClient from "@services/apiClient";
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
  createMessage: (sessionId?: string) => {
    const url = sessionId
      ? `${CHAT_URLS.SEND_CHAT}?sessionId=${sessionId}`
      : CHAT_URLS.SEND_CHAT;
    return apiClient.get(url);
  }
};