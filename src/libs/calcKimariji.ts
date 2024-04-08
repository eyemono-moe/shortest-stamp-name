/**
 * 連続する部分文字列を取得する
 *
 * @param str 文字列
 * @returns 連続する部分文字列の集合
 */
const getContinuousSubstrings = (str: string) => {
  const substrings = new Set<string>();
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      substrings.add(str.slice(i, j));
    }
  }
  return substrings;
};

export type Kimariji = {
  name: string;
  kimariji: string[];
};

/**
 * スタンプ名とクエリから優先度を計算する
 *
 * @param query クエリ(小文字)
 * @param targetName スタンプ名
 * @returns 優先度
 */
const calcPriority = (query: string, targetName: string) => {
  const lowerTargetName = targetName.toLowerCase();
  if (query === lowerTargetName) {
    return 0;
  }
  if (lowerTargetName.startsWith(query)) {
    return 1;
  }
  if (lowerTargetName.includes(query)) {
    return 2;
  }
  return 100;
};

export const calcKimariji = (
  stamps: string[],
  altNames: Record<string, string>,
): Kimariji[] => {
  // 辞書順にソート
  const sortedStamps = stamps.sort((a, b) => a.localeCompare(b));

  const searchResult = new Map<
    string,
    | {
        name: string;
        priority: number;
        isAltName: boolean;
      }
    | undefined
  >();

  /**
   * 与えられたクエリで検索した時最初にヒットするスタンプをマークする
   *
   * @param query クエリ
   * @param stamp スタンプ名
   * @param isAltName スタンプが別名かどうか
   * @param nameForCalcPriority 優先度計算用のスタンプ名
   * @returns マークが成功したかどうか
   */
  const mark = (
    query: string,
    stamp: string,
    isAltName: boolean,
    nameForCalcPriority: string,
  ) => {
    const priority = calcPriority(query, nameForCalcPriority);
    const res = searchResult.get(query);

    if (query.length === 1) {
      return;
    }

    if (
      res === undefined || // まだ検索結果がない
      res.priority > priority || // すでに検索結果があるが、優先度が低い
      (res.priority === priority && res.isAltName && !isAltName) // すでに検索結果があるが、優先度が同じでかつ別名でないものが優先される
    ) {
      searchResult.set(query, {
        name: stamp,
        priority,
        isAltName,
      });
    }
  };

  // すべての別名について、その別名に含まれる部分文字列でマークする
  for (const [altName, stamp] of Object.entries(altNames)) {
    if (altName.length === 1) {
      // 一字の時は確定
      searchResult.set(altName.toLowerCase(), {
        name: stamp,
        priority: 0,
        isAltName: true,
      });
      continue;
    }

    for (const substring of getContinuousSubstrings(altName.toLowerCase())) {
      mark(substring, stamp, true, altName);
    }
  }

  // すべてのスタンプについて、そのスタンプに含まれる部分文字列でマークする
  for (const stamp of sortedStamps) {
    if (stamp.length === 1) {
      // 一字の時は確定
      searchResult.set(stamp.toLowerCase(), {
        name: stamp,
        priority: 0,
        isAltName: false,
      });
      continue;
    }
    for (const substring of getContinuousSubstrings(stamp.toLowerCase())) {
      mark(substring, stamp, false, stamp);
    }
  }

  // スタンプ名でgroupby
  const groupedSearchResult = Object.groupBy(
    searchResult,
    ([, result]) => result?.name ?? "unknown",
  );

  const result = Object.entries(groupedSearchResult).map(([name, results]) => {
    const querys = results?.map(([query]) => query) ?? [];
    // 長さ最小のクエリを選択(複数あればすべて)
    const minLen = Math.min(...querys.map((query) => query.length));
    return {
      name,
      kimariji: querys.filter((query) => query.length === minLen),
    };
  });

  return result;
};
