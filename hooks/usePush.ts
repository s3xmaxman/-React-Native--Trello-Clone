/**
 * @file プッシュ通知を扱うためのカスタムフック
 *
 * このフックは、プッシュ通知の登録、受信、および通知への応答を処理します。
 * デバイスへのプッシュ通知の許可を求め、トークンを取得し、Supabaseに保存します。
 * また、通知を受信したときと、通知をタップしたときの処理を定義します。
 *
 * @module usePush
 */
import { useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useSupabase } from '@/context/SupabaseContext';
import { useRouter } from 'expo-router';

// 通知ハンドラを設定します。
// アラートの表示、サウンドの再生、バッジの設定を制御します。
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * プッシュ通知を扱うためのカスタムフック
 *
 * @returns {void} 
 */
export const usePush = () => {
  // 通知リスナー
  const notificationListener = useRef<Notifications.Subscription>();
  // 通知応答リスナー
  const responseListener = useRef<Notifications.Subscription>();
  // Supabaseのユーザーのプッシュトークンを設定する関数
  const { setUserPushToken } = useSupabase();
  // ルーター
  const router = useRouter();

  useEffect(() => {
    // プッシュ通知の登録
    registerForPushNotificationsAsync()
      .then((token) => {
        // トークンが取得できた場合、Supabaseに保存する
        if (token) {
          setUserPushToken!(token);
        }
      })
      .catch((error: any) => console.log('error', error));

    // 通知受信時の処理
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('recieved notification', notification);
    });

    // 通知タップ時の処理
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // 通知データからカードIDを取得
      const cardId = response.notification.request.content.data.card;
      // カード詳細画面に遷移
      router.push(`/board/card/${cardId}`);
    });

    // クリーンアップ関数
    return () => {
      // 通知リスナーを削除
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      // 通知応答リスナーを削除
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  /**
   * プッシュ通知の登録エラーを処理する関数
   *
   * @param {string} errorMessage - エラーメッセージ
   * @throws {Error} エラーメッセージを含むエラー
   */
  function handleRegistrationError(errorMessage: string) {
    // エラーメッセージを表示
    alert(errorMessage);
    // エラーをスロー
    throw new Error(errorMessage);
  }

  /**
   * プッシュ通知の登録を行う非同期関数
   *
   * @returns {Promise<string | undefined>} プッシュトークンまたはundefined
   * @throws {Error} 登録エラーが発生した場合
   */
  async function registerForPushNotificationsAsync() {
    // Androidの場合、通知チャンネルを設定する
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // デバイスの場合
    if (Device.isDevice) {
      // 既存の通知許可状態を取得
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      // 許可されていない場合、許可をリクエスト
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      // 許可されていない場合、エラーを処理
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      // プロジェクトIDを取得
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      // プロジェクトIDがない場合、エラーを処理
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        // プッシュトークンを取得
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        // プッシュトークンをログに出力
        console.log(pushTokenString);
        // プッシュトークンを返す
        return pushTokenString;
      } catch (e: unknown) {
        // エラーが発生した場合、エラーを処理
        handleRegistrationError(`${e}`);
      }
      // シミュレーターの場合、エラーを処理
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }
};
