/**
 * 会員ページの設定。
 *
 * FIREBASE_CONFIG に Firebase の「ウェブアプリの設定値」を入れると、
 * 登録・投票・ガチャの記録が Firestore に保存され、全員で共有される。
 * null のままだと、記録はその端末のブラウザ内だけに保存される（お試し用）。
 * 設定方法は member/README.md を参照。
 *
 * ※ Firebase のウェブ用設定値は公開して問題ない値（秘密の鍵ではない）。
 *   書き込みの制限は firestore.rules で行う。
 */
export const FIREBASE_CONFIG: Record<string, string> | null = null;

/** 1ユーザーが1日に投票できる回数（要件定義 Q-02 で確定させる。暫定値） */
export const VOTES_PER_DAY = 10;

/** 総選挙の締切（途中経過の「残り日数」に使う） */
export const ELECTION_DEADLINE = "2026-12-20T23:59:59+09:00";

/** ユーザー名の文字数 */
export const NAME_MAX = 12;
