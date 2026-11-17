import { CANDIDATES, candidatesOf } from "./data/candidates";
import { DEFAULT_AVATAR } from "./data/avatars";
import { NO_TEAM, TEAMS } from "./data/teams";
import type { Store } from "./store";
import type { Profile, Tally, VoteRecord } from "./store/types";

/** アプリ全体で共有する状態 */
export interface AppState {
  store: Store;
  me: Profile | null;
  tally: Tally;
  votes: VoteRecord[];
}

export const state = {} as AppState;

/** ゲストログイン用のプロフィール（記録は残らない） */
export const GUEST_PROFILE: Profile = { name: "ゲスト", icon: DEFAULT_AVATAR, team: NO_TEAM, guest: true };

export const isGuest = (): boolean => !!state.me?.guest;

/** 表示用の得票数＝ダミーの初期票＋実際に記録された票 */
export const votesOf = (candidate: string): number =>
  (CANDIDATES.find((c) => c.id === candidate)?.seed ?? 0) + (state.tally[candidate] ?? 0);

/** 球団ごとの順位（得票の多い順） */
export const rankingOf = (team: string) =>
  candidatesOf(team)
    .map((c) => ({ c, votes: votesOf(c.id) }))
    .sort((a, b) => b.votes - a.votes);

/** 各球団の現在1位 */
export const leaders = () => TEAMS.map((t) => ({ team: t, ...rankingOf(t.id)[0] }));
