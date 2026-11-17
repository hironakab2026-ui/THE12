export interface View {
  /** ブラウザのタブに出す名前 */
  title: string;
  html: () => string;
  /** 描画後のイベント設定 */
  bind?: (root: HTMLElement) => void;
  /** 得票数が変わったとき（全員の投票がリアルタイムで届く） */
  onTally?: (root: HTMLElement) => void;
}
