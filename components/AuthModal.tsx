import { AuthStrategy, ModalType } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";

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
  useWarmUpBrowser();
  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: AuthStrategy.Google,
  });
  const { startOAuthFlow: microsoftAuth } = useOAuth({
    strategy: AuthStrategy.Microsoft,
  });
  const { startOAuthFlow: slackAuth } = useOAuth({
    strategy: AuthStrategy.Slack,
  });
  const { startOAuthFlow: appleAuth } = useOAuth({
    strategy: AuthStrategy.Apple,
  });
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();

  /**
   * onSelectAuth関数は、認証戦略を受け取り、認証プロセスを実行します。
   *
   * @param {AuthStrategy} strategy - 認証戦略
   * @returns {Promise<void>} 認証プロセスの結果
   */
  const onSelectAuth = async (strategy: AuthStrategy) => {
    // signInとsignUpが両方とも存在するかどうかを確認
    if (!signIn || !signUp) {
      return null;
    }

    console.log("選択された認証戦略:", strategy);

    /**
     * 認証戦略に基づいて、対応する認証関数を選択します。
     */
    const selectedAuth = {
      [AuthStrategy.Google]: googleAuth,
      [AuthStrategy.Microsoft]: microsoftAuth,
      [AuthStrategy.Slack]: slackAuth,
      [AuthStrategy.Apple]: appleAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      // ClerkのページでAuthentication strategiesのPasswordをTrueにしないと、認証できない。
      console.log("認証結果:", { createdSessionId, setActive });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        console.log("OAuth成功:", createdSessionId);
      } else {
        console.log("OAuth失敗: createdSessionIdが空です");
      }
    } catch (err) {
      console.log("OAuthエラー:", err);
    }
  };

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
