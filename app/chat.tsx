import LoadingModal from "@components/ui/loadingModal";
import color from "@constants/color";
import { globalStyles } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  clearMessages,
  createMessage,
  fetchAllChatSessions,
  fetchAllMessages,
  setCurrentSessionId,
} from "@features/chat/chatSlice";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateChatStreamBodyRequest, SessionDTO } from "../types/chat";

const MessageBubble = ({
  message,
  isUser,
}: {
  message: string;
  isUser: boolean;
}) => (
  <View
    style={[
      styles.messageContainer,
      isUser ? styles.userMessageContainer : styles.aiMessageContainer,
    ]}
  >
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text
        style={[globalStyles.regular, isUser ? styles.userText : styles.aiText]}
      >
        {message}
      </Text>
    </View>
  </View>
);

export default function ChatBoxScreen() {
  const flatListRef = useRef<FlatList>(null);
  const dispatch = useAppDispatch();

  const { messages, currentSessionId, loading, sessions } = useAppSelector(
    (state: RootState) => state.chat
  );
  const { user } = useAppSelector((state: RootState) => state.user);

  const [inputText, setInputText] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isPro,setIsPro] = useState<boolean>(false);

  // ✅ Lấy user khi mới vào
  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, []);

  // ✅ Khi có session → fetch message

  useEffect(() => {
    if(user){
      if(user.currentPlanId !== 1){
        setIsPro(true);
      }
    }
  }, [user])

  useEffect(() => {
    if (!currentSessionId) return;
    dispatch(
      fetchAllMessages({
        sessionId: currentSessionId,
        pageIndex: 1,
        pageSize: 30,
        orderBy: "CreatedAt",
        isAscending: false,
      })
    );
  }, [dispatch, currentSessionId]);

  // ✅ Gửi tin nhắn
  const handleSend = async () => {
    if(!isPro){
      Alert.alert(
        "Nâng cấp tài khoản",
        "Vui lòng nâng cấp tài khoản của bạn lên bản trả phí để sử dụng tính năng này!",
        [
          {
            text: "Nâng cấp ngay",
            style: "default",
            onPress: () => navigateCustom("/subscription"),
          },
          {
            text: "Rời khỏi",
            style: "destructive",
          },
        ]
      );
      return;
    }
    const trimmed = inputText.trim();
    if (!trimmed || !user?.id) return;

    setInputText("");

    try {
      const res = await dispatch(
        createMessage({
          sessionId: currentSessionId || undefined,
          body: {
            userId: user.id,
            question: trimmed,
          } as CreateChatStreamBodyRequest,
        })
      );

      if (createMessage.fulfilled.match(res)) {
        console.log("✅ AI response received successfully.");

        const sessionRes = await dispatch(
          fetchAllChatSessions({
            userId: user.id,
            pageIndex: 1,
            pageSize: 10,
            orderBy: "CreatedAt",
            isAscending: false,
          })
        );

        if (fetchAllChatSessions.fulfilled.match(sessionRes)) {
          const firstSession = sessionRes.payload.data[0];
          if (firstSession) {
            dispatch(setCurrentSessionId(firstSession.id));
            dispatch(
              fetchAllMessages({
                sessionId: firstSession.id,
                pageIndex: 1,
                pageSize: 30,
                orderBy: "CreatedAt",
                isAscending: false,
              })
            );
          }
        }
      } else {
        console.warn("❌ Lỗi gửi tin nhắn:", res.payload);
      }
    } catch (err) {
      console.warn("❌ Exception during API call:", err);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 150);
  };

  // ✅ Khi bấm vào 1 session
  const handleSelectSession = async (session: SessionDTO) => {
    setShowHistoryModal(false);
    dispatch(setCurrentSessionId(session.id));
    await dispatch(
      fetchAllMessages({
        sessionId: session.id,
        pageIndex: 1,
        pageSize: 30,
        orderBy: "CreatedAt",
        isAscending: false,
      })
    );
  };

  const handleShowHistory = async () => {
    if (!user) return null;
    await dispatch(
      fetchAllChatSessions({
        userId: user.id,
        pageIndex: 1,
        pageSize: 10,
        orderBy: "CreatedAt",
        isAscending: false,
      })
    );
    setShowHistoryModal(true);
  };

  const handleNewChat = () => {
    dispatch(clearMessages());
    dispatch(setCurrentSessionId(null));
    setShowHistoryModal(false);
  };

  const renderItem = ({ item }: any) => (
    <>
      {item.answer && <MessageBubble message={item.answer} isUser={false} />}
      {item.question && <MessageBubble message={item.question} isUser />}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.buttonGoBack}
          onPress={() => navigateCustom("/tabs")}
        >
          <Ionicons name="arrow-back-outline" size={24} color={color.white} />
        </TouchableOpacity>

        <Text style={[globalStyles.bold, styles.headerTitle]}>Chat Box</Text>

        <TouchableOpacity
          style={styles.buttonHistorySession}
          onPress={() => handleShowHistory()}
        >
          <AntDesign name="clock-circle" size={22} color={color.white} />
        </TouchableOpacity>
      </View>

      {/* Modal lịch sử session */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[globalStyles.bold, styles.modalTitle]}>
              🕓 Lịch sử hội thoại
            </Text>

            <TouchableOpacity
              style={[styles.sessionItem, styles.newChatButton]}
              onPress={handleNewChat} // Cần định nghĩa hàm handleNewChat
            >
              <Text style={[globalStyles.bold, styles.newChatText]}>
                + Bắt đầu cuộc hội thoại mới
              </Text>
            </TouchableOpacity>

            <ScrollView style={styles.sessionList}>
              {sessions && sessions.length > 0 ? (
                sessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    style={[
                      styles.sessionItem,
                      session.id === currentSessionId &&
                        styles.sessionItemActive,
                    ]}
                    onPress={() => handleSelectSession(session)}
                  >
                    <Text
                      style={[
                        globalStyles.regular,
                        session.id === currentSessionId
                          ? styles.sessionTitleActive
                          : styles.sessionTitle,
                      ]}
                    >
                      {session.title || "Không tiêu đề"}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={[globalStyles.regular, styles.noSessionText]}>
                  Chưa có lịch sử hội thoại
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowHistoryModal(false)}
            >
              <Text style={[globalStyles.bold, styles.closeText]}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Nội dung chat */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
          inverted
        />

        {loading && (
          <LoadingModal visible={loading} text="Đang tải dữ liệu..." />
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, globalStyles.regular]}
            placeholder="Nhập tin nhắn của bạn..."
            placeholderTextColor={color.black_30}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? color.dark_green
                  : color.black_30,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="arrow-up"
              size={22}
              color={inputText.trim() ? color.white : color.grey}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

//
// 💅 Styles
//
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: color.background },
  keyboardAvoidingView: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: color.dark_green,
    borderBottomColor: color.white,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    color: color.white,
    flex: 1,
    textAlign: "center",
  },
  buttonGoBack: { width: 40, height: 40, justifyContent: "center" },
  buttonHistorySession: { width: 40, height: 40, justifyContent: "center" },
  flatListContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageContainer: { flexDirection: "row", marginVertical: 5 },
  userMessageContainer: { justifyContent: "flex-end", alignSelf: "flex-end" },
  aiMessageContainer: { justifyContent: "flex-start", alignSelf: "flex-start" },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  userBubble: { backgroundColor: color.dark_green, borderBottomRightRadius: 6 },
  aiBubble: { backgroundColor: color.white, borderBottomLeftRadius: 6 },
  userText: { color: color.white, fontSize: 15 },
  aiText: { color: color.black, fontSize: 15 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: color.border,
    backgroundColor: color.white,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: color.black_10,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 15,
    color: color.black,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: color.white,
    borderRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    color: color.black,
    textAlign: "center",
    marginBottom: 10,
  },
  newChatButton: {
    backgroundColor: color.light_green, // Nền xanh nhạt, nổi bật
    borderWidth: 1,
    borderColor: color.dark_green, // Viền xanh đậm
    marginBottom: 15, // Khoảng cách với danh sách lịch sử
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  newChatText: {
    color: color.white, // Chữ xanh đậm
    fontSize: 16,
    textAlign: "center",
  },
  sessionList: { marginBottom: 10 },
  sessionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: color.black_10,
    marginBottom: 8,
  },
  sessionItemActive: { backgroundColor: color.dark_green },
  sessionTitle: { color: color.black },
  sessionTitleActive: { color: color.white },
  noSessionText: { textAlign: "center", color: color.black_50 },
  modalCloseButton: {
    backgroundColor: color.dark_green,
    paddingVertical: 10,
    borderRadius: 12,
  },
  closeText: { color: color.white, textAlign: "center", fontSize: 16 },
});
