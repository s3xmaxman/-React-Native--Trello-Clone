import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { AuthStrategy, ModalType } from "@/types/enums";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

const LOGIN_OPTIONS = [
  {
    text: "Googleで続行",
    icon: require("@/assets/images/login/google.png"),
    strategy: AuthStrategy.Google,
  },
  {
    text: "Microsoftで続行",
    icon: require("@/assets/images/login/microsoft.png"),
    strategy: AuthStrategy.Microsoft,
  },
  {
    text: "Appleで続行",
    icon: require("@/assets/images/login/apple.png"),
    strategy: AuthStrategy.Apple,
  },
  {
    text: "Slackで続行",
    icon: require("@/assets/images/login/slack.png"),
    strategy: AuthStrategy.Slack,
  },
];

interface AuthModalProps {
  authType: ModalType | null;
}

const AuthModal = ({ authType }: AuthModalProps) => {
  const onSelectAuth = async (strategy: AuthStrategy) => {};
  return (
    <BottomSheetView style={[styles.modalContainer]}>
      <TouchableOpacity style={styles.modalBtn}>
        <Ionicons name="mail-outline" size={20} />
        <Text style={styles.btnText}>
          Eメールから
          {authType === ModalType.Login ? "ログイン" : "新規登録"}
        </Text>
      </TouchableOpacity>
      {LOGIN_OPTIONS.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.modalBtn}
          onPress={() => onSelectAuth(option.strategy!)}
        >
          <Image source={option.icon} style={styles.btnIcon} />
          <Text style={styles.btnText}>{option.text}</Text>
        </TouchableOpacity>
      ))}
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "flex-start",
    padding: 20,
    gap: 20,
  },
  modalBtn: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
  btnIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  btnText: {
    fontSize: 18,
  },
});

export default AuthModal;
