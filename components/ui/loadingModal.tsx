import color from "@constants/color"; // dùng màu bạn có sẵn
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

type LoadingModalProps = {
  visible: boolean;
  text?: string;
};

const LoadingModal: React.FC<LoadingModalProps> = ({ visible, text }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={color.dark_green} />
          {text && <Text style={styles.text}>{text}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: color.dark_green,
    fontWeight: "500",
  },
});

export default LoadingModal;
