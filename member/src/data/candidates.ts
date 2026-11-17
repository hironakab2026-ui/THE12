import { TEAMS } from "./teams";

/**
 * 総選挙の候補選手（デモ用）。
 * 選手名は出さず、背番号で表す。各球団30人。
 */
export interface Candidate {
  id: string;
  team: string;
  no: number;
  /** 表示名（「背番号18」） */
  name: string;
  /** 途中経過の初期値（デモで空っぽに見えないようにするダミー票） */
  seed: number;
}

/** 各球団の候補の背番号（30人） */
export const NUMBERS = [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 31, 33, 44, 51];

/** 今年の THE 12（デモ上の現メンバーの背番号） */
const CURRENT_NO: Record<string, number> = {
  giants: 18, tigers: 5, baystars: 2, carp: 1, swallows: 23, dragons: 20,
  hawks: 3, fighters: 16, marines: 13, eagles: 1, buffaloes: 17, lions: 21,
};

/** 再現性のあるダミー票（同じ候補はいつも同じ数）。今年のメンバーは多め */
const seedFor = (team: string, ti: number, no: number): number =>
  20 + ((ti * 53 + no * 37) % 97) * 3 + (CURRENT_NO[team] === no ? 300 : 0);

export const CANDIDATES: Candidate[] = TEAMS.flatMap((t, ti) =>
  NUMBERS.map((no) => ({ id: `${t.id}-${no}`, team: t.id, no, name: `背番号${no}`, seed: seedFor(t.id, ti, no) })),
);

export const findCandidate = (id: string): Candidate | undefined => CANDIDATES.find((c) => c.id === id);
export const candidatesOf = (team: string): Candidate[] => CANDIDATES.filter((c) => c.team === team);

export const CURRENT_12: Candidate[] = TEAMS.map((t) => findCandidate(`${t.id}-${CURRENT_NO[t.id]}`)!);
