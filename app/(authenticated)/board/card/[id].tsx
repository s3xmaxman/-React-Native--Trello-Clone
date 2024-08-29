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
import UserListItem from "@/components/UserListItem";

const Page = () => {
  const {
    getCardInfo,
    getBoardMember,
    getFileFromPath,
    updateCard,
    assignCard,
  } = useSupabase();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [card, setCard] = useState<Task>();
  const [member, setMember] = useState<User[]>();
  const [imagePath, setImagePath] = useState<string>("");

  if (card?.image_url) {
    getFileFromPath!(card.image_url).then((path) => {
      if (path) {
        setImagePath(path);
      }
    });
  }

  useEffect(() => {
    if (!id) return;
    loadInfo();
  }, [id]);

  const loadInfo = async () => {
    const data = await getCardInfo!(id);
    setCard(data);

    const members = await getBoardMember!(data.board_id);
    setMember(members);
  };

  const saveAndClose = async () => {
    await updateCard!(card!);
    await router.back();
  };

  const onArchiveCard = async () => {
    if (!card) return;
    await updateCard!({ ...card, done: true });
    await router.back();
  };

  const onAssignUser = async (user: User) => {
    if (!card) return;
    const { data, error } = await assignCard!(card.id, user.id);

    setCard(data);
    bottomSheetModalRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={saveAndClose}>
                <Ionicons name="close" size={24} color={Colors.grey} />
              </TouchableOpacity>
            ),
          }}
        />
        {card && (
          <>
            {!card.image_url && (
              <TextInput
                style={styles.input}
                value={card.title}
                multiline
                onChangeText={(text: string) =>
                  setCard({ ...card, title: text })
                }
              ></TextInput>
            )}

            <TextInput
              style={styles.input}
              value={card.description || ""}
              multiline
              onChangeText={(text: string) =>
                setCard({ ...card, description: text })
              }
            />

            {imagePath && (
              <>
                {card.image_url && (
                  <Image
                    source={{ uri: imagePath }}
                    style={{
                      width: "100%",
                      height: 400,
                      resizeMode: "contain",
                      borderRadius: 4,
                      backgroundColor: "#f3f3f3",
                    }}
                  />
                )}
              </>
            )}

            <View style={styles.memberContainer}>
              <Ionicons name="person" size={24} color={Colors.grey} />

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => bottomSheetModalRef.current?.present()}
              >
                {!card.assigned_to ? (
                  <Text>アサイン...</Text>
                ) : (
                  <Text>
                    Assigned to {card.users?.first_name || card.users?.email}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onArchiveCard} style={styles.btn}>
              <Text style={styles.btnText}>保存</Text>
            </TouchableOpacity>
          </>
        )}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          handleStyle={{
            backgroundColor: DefaultTheme.colors.background,
            borderRadius: 12,
          }}
          backdropComponent={renderBackdrop}
          enableOverDrag={false}
          enablePanDownToClose
        >
          <View style={styles.bottomContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <Button
                title="Cancel"
                onPress={() => bottomSheetModalRef.current?.close()}
              />
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <FlatList
                data={member}
                keyExtractor={(item) => `${item.id}`}
                renderItem={(item) => (
                  <UserListItem onPress={onAssignUser} element={item} />
                )}
                contentContainerStyle={{ gap: 8 }}
              />
            </View>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
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
