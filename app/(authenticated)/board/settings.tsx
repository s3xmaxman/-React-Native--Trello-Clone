import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";
import { Colors } from "@/constants/Colors";
import { Board } from "@/types/enums";

const settings = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getBoardInfo, updateBoard, deleteBoard } = useSupabase();
  const router = useRouter();
  const [board, setBoard] = useState<Board>();

  useEffect(() => {
    if (!id) return;
    loadInfo();
  }, []);

  const loadInfo = async () => {
    if (!id) return;
    const data = await getBoardInfo!(id);
    setBoard(data);
  };

  const onUpdateBoard = async () => {
    if (!board) return;
    const updated = await updateBoard!(board!);
    setBoard(updated);
  };

  const onDeleteBoard = async () => {
    await deleteBoard!(`${id}`);
    router.dismissAll();
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={{ fontSize: 12, marginBottom: 5, color: Colors.grey }}>
          ボード名
        </Text>
        <TextInput
          value={board?.title}
          onChangeText={(e) => setBoard({ ...board!, title: e })}
          style={{ fontSize: 20, color: Colors.fontDark }}
          returnKeyType="done"
          enterKeyHint="done"
          onEndEditing={onUpdateBoard}
        />
      </View>
      <TouchableOpacity onPress={onDeleteBoard} style={styles.deleteBtn}>
        <Text style={{ color: "red" }}>削除</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 8,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  deleteBtn: {
    backgroundColor: "#fff",
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  fullBtn: {
    backgroundColor: Colors.primary,
    padding: 8,
    marginLeft: 32,
    marginRight: 16,
    marginTop: 8,
    borderRadius: 6,
    alignItems: "center",
  },
});

export default settings;
