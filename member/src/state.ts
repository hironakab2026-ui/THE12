import { CANDIDATES, candidatesOf } from "./data/candidates";
import { TEAMS } from "./data/teams";
import type { Store } from "./store";
import type { OwnedCard, Profile, Tally, VoteRecord } from "./store/types";

/** アプリ全体で共有する状態 */
export interface AppState {
  store: Store;
  me: Profile | null;
  tally: Tally;
  votes: VoteRecord[];
  cards: OwnedCard[];
}

export const state = {} as AppState;

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
