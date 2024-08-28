import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";
import { Colors } from "@/constants/Colors";
import { Board, User } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import UserListItem from "@/components/UserListItem";

const settings = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getBoardInfo, updateBoard, deleteBoard, getBoardMember } =
    useSupabase();
  const router = useRouter();
  const [board, setBoard] = useState<Board>();
  const [members, setMembers] = useState<User[]>();

  useEffect(() => {
    if (!id) return;
    loadInfo();
  }, []);

  const loadInfo = async () => {
    if (!id) return;
    const data = await getBoardInfo!(id);
    setBoard(data);

    const members = await getBoardMember!(id);
    setMembers(members);
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

      <View style={styles.container}>
        <View style={{ flexDirection: "row", gap: 14 }}>
          <Ionicons name="person-outline" size={18} color={Colors.fontDark} />
          <Text
            style={{ fontWeight: "bold", color: Colors.fontDark, fontSize: 16 }}
          >
            メンバー
          </Text>
        </View>

        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <UserListItem element={item} onPress={() => {}} />
          )}
          contentContainerStyle={{ gap: 8 }}
          style={{ marginVertical: 12 }}
        />

        <Link href={`/(authenticated)/board/invite?id=${id}`} asChild>
          <TouchableOpacity style={styles.fullBtn}>
            <Text style={{ fontSize: 16, color: Colors.fontLight }}>招待</Text>
          </TouchableOpacity>
        </Link>
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
