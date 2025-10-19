import color from "@constants/color";
import { globalStyles } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    FlatList, // Import Platform để xác định hệ điều hành
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data tin nhắn
const MOCK_MESSAGES = [
    { id: '1', text: 'Chào bạn, tôi muốn tìm một công thức ăn kiêng low-carb.', sender: 'user' },
    { id: '2', text: 'Chào bạn! Tôi có thể giúp. Bạn muốn tìm công thức cho bữa sáng, trưa, hay tối?', sender: 'ai' },
    { id: '3', text: 'Tôi muốn bữa tối, món nào nhanh và ít calo.', sender: 'user' },
    { id: '4', text: 'Tuyệt vời. Món "Cá hồi nướng bơ tỏi và măng tây" rất phù hợp. Bạn cần công thức chi tiết không?', sender: 'ai' },
];

// Component cho 1 tin nhắn
const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <View style={[
            styles.messageContainer,
            isUser ? styles.userMessageContainer : styles.aiMessageContainer
        ]}>
            <View style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.aiBubble
            ]}>
                <Text style={[
                    globalStyles.regular,
                    isUser ? styles.userText : styles.aiText
                ]}>
                    {message.text}
                </Text>
            </View>
        </View>
    );
};

export default function ChatBoxScreen() {
    // Sửa lỗi TypeScript bằng cách khai báo rõ ràng kiểu của Ref
    const flatListRef = useRef<FlatList>(null);
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: inputText.trim(),
                sender: 'user',
            };
            
            // Thêm tin nhắn mới vào đầu mảng vì FlatList đang dùng `inverted`
            setMessages(prev => [newMessage, ...prev]); 
            setInputText('');

            // Cuộn về tin nhắn mới nhất
            if (flatListRef.current) {
                // Do dùng inverted, cuộn offset 0 là cuộn đến tin nhắn mới nhất
                flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }

            console.log("Tin nhắn gửi đi:", newMessage.text);
        }
    };

    return (
        // Dùng SafeAreaView để tránh notch và status bar
        <SafeAreaView style={styles.safeArea}> 
            
            {/* HEADER SECTION: Đặt ngoài KeyboardAvoidingView */}
            <View style={styles.headerContainer}>
                {/* Nút Go Back */}
                <TouchableOpacity style={styles.buttonGoBack} onPress={() => console.log('Go Back Pressed')}>
                    <Ionicons name="arrow-back-outline" size={24} color={color.white} />
                </TouchableOpacity>

                {/* Tiêu đề */}
                <Text style={[globalStyles.bold, styles.headerTitle]}>
                    Chat Box
                </Text>

                {/* Placeholder để căn giữa tiêu đề (đảm bảo không gian) */}
                <View style={styles.buttonGoBack} /> 
            </View>
            
            {/* KEYBOARD AVOIDING VIEW: Chỉ bọc phần nội dung có thể cuộn và phần input */}
            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                keyboardVerticalOffset={0} 
            >
                {/* Khu vực hiển thị tin nhắn */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MessageBubble message={item} />}
                    contentContainerStyle={styles.flatListContent}
                    inverted 
                />

                {/* Khu vực nhập liệu */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.textInput, globalStyles.regular]}
                        placeholder="Nhập tin nhắn của bạn..."
                        placeholderTextColor={color.black_30}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        textAlignVertical="center" 
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { 
                                backgroundColor: inputText.trim() ? color.dark_green : color.black_30
                            }
                        ]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons 
                            name="arrow-up" 
                            size={24} 
                            color={inputText.trim() ? color.white : color.grey} 
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: color.background, // Màu nền #EDEDED
    },
    keyboardAvoidingView: {
        flex: 1, 
    },
    // --- STYLES CHO HEADER ---
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: color.dark_green, // Màu chủ đạo
        borderBottomWidth: 1,
        borderBottomColor: color.border,
    },
    headerTitle: {
        fontSize: 18,
        color: color.white,
        flex: 1, 
        textAlign: 'center',
    },
    buttonGoBack: {
        width: 40, 
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    // --- STYLES CỦA CHATBOX ---
    flatListContent: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexGrow: 1, 
        justifyContent: 'flex-end',
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    userMessageContainer: {
        justifyContent: 'flex-end', 
    },
    aiMessageContainer: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        shadowColor: color.black,
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    userBubble: {
        backgroundColor: color.dark_green, 
        borderBottomRightRadius: 5, 
    },
    aiBubble: {
        backgroundColor: color.white,
        borderBottomLeftRadius: 5, 
    },
    userText: {
        color: color.white,
        fontSize: 15,
    },
    aiText: {
        color: color.black,
        fontSize: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: color.black_30,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 10, 
        paddingBottom: 10,
        marginRight: 10,
        fontSize: 15,
        color: color.black,
        textAlignVertical: 'center', 
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});