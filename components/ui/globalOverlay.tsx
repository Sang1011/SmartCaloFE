// GlobalOverlay.tsx
import color from "@constants/color";
import React from "react";
import { Modal, View, StyleSheet } from "react-native";

interface GlobalOverlayProps {
  visible: boolean;
  children?: React.ReactNode;
}

export default function GlobalOverlay({ visible, children }: GlobalOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.black_50, // nền mờ
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    // shadow cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation cho Android
    elevation: 5,
  },
});
