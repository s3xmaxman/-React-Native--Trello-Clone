import { useSupabase } from "@/context/SupabaseContext";
import { Board, Task, User } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  FlatList,
} from "react-native";
import { Colors } from "@/constants/Colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { DefaultTheme } from "@react-navigation/native";
// import UserListItem from '@/components/UserListItem';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    marginVertical: 8,
  },
  memberContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 8,
    alignItems: "center",
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
  btnText: {
    fontSize: 18,
  },
  bottomContainer: {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
    gap: 16,
  },
});

export default Page;
