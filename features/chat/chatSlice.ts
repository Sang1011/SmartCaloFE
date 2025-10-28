import { chatApi } from "@features/chat/chatApi";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    CreateChatStreamBodyRequest,
    CreateChatStreamBodyResponse,
    GetAllChatSessionResponse,
    GetAllMessageResponse,
    MessageDTO,
    SessionDTO,
} from "../../types/chat";

export interface ChatState {
    sessions: SessionDTO[];
    messages: MessageDTO[];
    loading: boolean;
    error: string | null;
    currentSessionId: string | null;
    currentAnswer : string | null;
}

const initialState: ChatState = {
    sessions: [],
    messages: [],
    loading: false,
    error: null,
    currentSessionId: null,
    currentAnswer: null,
};

//
// 🌀 Lấy danh sách session
//
export const fetchAllChatSessions = createAsyncThunk<
    GetAllChatSessionResponse,
    {
        userId: string;
        pageIndex: number;
        pageSize: number;
        orderBy: string;
        isAscending: boolean;
    }
>("chat/fetchAllChatSessions", async (params, { rejectWithValue }) => {
    try {
        const response = await chatApi.getAllChatSession(
            params.userId,
            params.pageIndex,
            params.pageSize,
            params.orderBy,
            params.isAscending
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch sessions");
    }
});

//
// 💬 Lấy danh sách messages trong 1 session
//
export const fetchAllMessages = createAsyncThunk<
    GetAllMessageResponse,
    {
        sessionId: string;
        pageIndex: number;
        pageSize: number;
        orderBy: string;
        isAscending: boolean;
    }
>("chat/fetchAllMessages", async (params, { rejectWithValue }) => {
    try {
        const response = await chatApi.getAllChatMessage(
            params.sessionId,
            params.pageIndex,
            params.pageSize,
            params.orderBy,
            params.isAscending
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch messages");
    }
});

//
// ✉️ Gửi message (tự tạo session nếu cần)
//
export const createMessage = createAsyncThunk<
    CreateChatStreamBodyResponse,
    { sessionId?: string, body: CreateChatStreamBodyRequest },
    { rejectValue: string }
>("chat/createMessage", async ({ sessionId, body }, { rejectWithValue }) => {
    try {
        const response = await chatApi.createMessage(body, sessionId);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to create message");
    }
});

//
// 🧱 Slice
//
const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setCurrentSessionId: (state, action: PayloadAction<string | null>) => {
            state.currentSessionId = action.payload;
        },
        addLocalMessage: (state, action: PayloadAction<MessageDTO>) => {
            state.messages.unshift(action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        // 📌 Fetch Sessions
        builder
            .addCase(fetchAllChatSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllChatSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = action.payload.data
            })
            .addCase(fetchAllChatSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // 📌 Fetch Messages
        builder
            .addCase(fetchAllMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload.data;
            })
            .addCase(fetchAllMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // 📌 Create Message
        builder
            .addCase(createMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(createMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAnswer = action.payload.streamedResponse.join("\n\n"); 
            })
            .addCase(createMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to send message";
            });
    },
});

export const { setCurrentSessionId, clearMessages, addLocalMessage } =
    chatSlice.actions;
export default chatSlice.reducer;
