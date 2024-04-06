/**
 * スタンプの別名テーブルを取得
 */
const getAltnameTable = () =>
  fetch(
    "https://raw.githubusercontent.com/traPtitech/traQ_S-UI/master/src/assets/emoji_altname_table.json",
  ).then(
    (response) =>
      response.json() as Promise<{
        altNameTable: Record<string, string>;
      }>,
  );

/**
 * スタンプ一覧を取得(unicode, traPオリジナルすべて)
 */
const getStamps = (token: string) =>
  fetch("https://q.trap.jp/api/v3/stamps", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then(
      (res) =>
        res.json() as Promise<
          {
            name: string;
          }[]
        >,
    )
    .then((stamps) => stamps.map((stamp) => stamp.name));

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

const calcPriority = (query: string, targetName: string) => {
  if (query === targetName) {
    return 0;
  }
  if (targetName.startsWith(query)) {
    return 1;
  }
  if (targetName.includes(query)) {
    return 2;
  }
  return 100;
};

export const calcKimariji = async () => {
  const TOKEN = process.env.BOT_ACCESS_TOKEN;
  if (TOKEN === undefined) {
    throw new Error("TOKEN is not defined");
  }
  const stamps = await getStamps(TOKEN);
  const altNames = (await getAltnameTable()).altNameTable;

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
   * 与えられてクエリで検索した時最初にヒットするスタンプをマークする
   *
   * @param query クエリ
   * @param name スタンプ名
   * @param isAltName スタンプが別名かどうか
   * @param nameForCalcPriority 優先度計算用のスタンプ名
   * @returns マークが成功したかどうか
   */
  const mark = (
    query: string,
    name: string,
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
        name: name,
        priority,
        isAltName,
      });
    }
  };

  // すべての別名について、その別名に含まれる部分文字列でマークする
  for (const [altName, stamp] of Object.entries(altNames)) {
    for (const substring of getContinuousSubstrings(altName.toLowerCase())) {
      mark(substring, stamp, true, altName);
    }
  }

  // すべてのスタンプについて、そのスタンプに含まれる部分文字列でマークする
  for (const stamp of sortedStamps) {
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
