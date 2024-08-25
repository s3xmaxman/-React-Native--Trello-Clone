import { Colors } from "@/constants/Colors";
import { ModalType } from "@/types/enums";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

export default function Index() {
  const { top } = useSafeAreaInsets();
  const showModal = async (type: ModalType) => {};
  const openLink = async () => {
    WebBrowser.openBrowserAsync("https://github.com/s3xmaxman");
  };

  return (
    <View style={[styles.container, { paddingTop: top + 30 }]}>
      <Image
        source={require("@/assets/images/login/trello.png")}
        style={styles.image}
      />
      <Text style={styles.introText}>
        チームワークを進めよう - どこにいても
      </Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "white" }]}
          onPress={() => showModal(ModalType.Login)}
        >
          <Text style={[styles.btnText, { color: Colors.primary }]}>
            ログイン
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "white" }]}
          onPress={() => showModal(ModalType.SignUp)}
        >
          <Text style={[styles.btnText, { color: Colors.primary }]}>
            新規登録
          </Text>
        </TouchableOpacity>
        <Text style={styles.description}>
          新規登録することで、あなたは{" "}
          <Text style={styles.link} onPress={openLink}>
            ユーザー通知
          </Text>
          および{" "}
          <Text style={styles.link} onPress={openLink}>
            プライバシーポリシー
          </Text>
          に同意したことになります。
        </Text>
        <Text style={styles.link}>ログインまたは新規登録ができない場合</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  image: {
    height: 450,
    paddingHorizontal: 40,
    resizeMode: "contain",
  },
  introText: {
    fontWeight: "600",
    color: "white",
    fontSize: 17,
    padding: 30,
  },
  bottomContainer: {
    width: "100%",
    paddingHorizontal: 40,
    gap: 10,
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
  description: {
    paddingTop: 30,
    fontSize: 12,
    textAlign: "center",
    color: "#fff",
    marginHorizontal: 60,
  },
  link: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
