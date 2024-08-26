/**
 * Supabaseクライアントを作成するモジュール
 *
 * このモジュールは、Clerkのセッションを使用してSupabaseクライアントを作成します。
 * 主な仕様として、Clerkから取得したトークンをAuthorizationヘッダーに設定します。
 *
 * 制限事項:
 * - 環境変数EXPO_PUBLIC_SUPABASE_URLとEXPO_PUBLIC_SUPABASE_ANON_KEYが必要です。
 * - Clerkのセッションが存在しない場合、トークンは取得できません。
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string; // SupabaseのURLを環境変数から取得
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string; // Supabaseの匿名キーを環境変数から取得

import { createClient } from "@supabase/supabase-js"; // Supabaseクライアント作成用の関数をインポート

declare global {
  interface Window {
    Clerk: {
      session?: {
        getToken: (options: { template: string }) => Promise<string>; // Clerkセッションからトークンを取得するメソッド
      };
    };
  }
}

/**
 * Clerkを使用してSupabaseクライアントを作成します。
 *
 * @returns {import("@supabase/supabase-js").SupabaseClient} Supabaseクライアント
 * @throws {Error} 環境変数が設定されていない場合やトークン取得に失敗した場合
 */
function createClerkSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        // Clerkからトークンを非同期で取得
        const clerkToken = await window.Clerk.session?.getToken({
          template: "supabase",
        });

        const headers = new Headers(options?.headers); // 既存のヘッダーを取得
        headers.set("Authorization", `Bearer ${clerkToken}`); // Authorizationヘッダーにトークンを設定

        return fetch(url, {
          ...options,
          headers, // 更新されたヘッダーを使用してリクエストを送信
        });
      },
    },
  });
}

export const client = createClerkSupabaseClient(); // Supabaseクライアントをエクスポート
