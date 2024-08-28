import { useSupabase } from "@/context/SupabaseContext";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { DefaultTheme } from "@react-navigation/native";
import { User } from "@/types/enums";
import { useHeaderHeight } from "@react-navigation/elements";
import UserListItem from "@/components/UserListItem";

const Page = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { findUsers, addUserToBoard } = useSupabase();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState<User[]>([]);
  const headerHeight = useHeaderHeight();

  const onSearchUSer = async () => {
    const users = await findUsers!(search);
    setUserList(users);
  };

  const onAddUser = async (user: User) => {
    if (!user || !id) return;
    await addUserToBoard!(id, user.id);
    await router.dismiss();
  };

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: DefaultTheme.colors.background },
          headerShadowVisible: false,
          headerSearchBarOptions: {
            inputType: "email",
            autoCapitalize: "none",
            autoFocus: true,
            placeholder: "Invite by name, username or email",
            cancelButtonText: "Done",
            onChangeText: (e) => setSearch(e.nativeEvent.text),
            onCancelButtonPress: onSearchUSer,
          },
        }}
      />
      <FlatList
        data={userList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={(item) => (
          <UserListItem onPress={onAddUser} element={item} />
        )}
        style={{ marginTop: 60 + headerHeight }}
        contentContainerStyle={{ gap: 8 }}
      />
    </View>
  );
};

export default Page;
