import Elysia from "elysia";
import { Cache } from "./cache";
import { calcKimariji } from "./libs/calcKimariji";
import { Api } from "./libs/traq/api";

/**
 * スタンプの別名テーブルを取得
 */
const getAltnameTable = () =>
  fetch(
    "https://raw.githubusercontent.com/traPtitech/traQ_S-UI/master/src/assets/emoji_altname_table.json",
  )
    .then(
      (response) =>
        response.json() as Promise<{
          altNameTable: Record<string, string>;
        }>,
    )
    .then((data) => data.altNameTable);

/**
 * スタンプ一覧を取得(unicode, traPオリジナルすべて)
 */
const getStamps = (token: string) => {
  const api = new Api({
    baseApiParams: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
  return api.stamps.getStamps().then((r) => r.data.map((s) => s.name));
};

const updateKimariji = async () => {
  const TOKEN = process.env.BOT_ACCESS_TOKEN;
  if (TOKEN === undefined) {
    throw new Error("TOKEN is not defined");
  }
  const [stamps, altNames] = await Promise.all([
    getStamps(TOKEN),
    getAltnameTable(),
  ]);

  return calcKimariji(stamps, altNames);
};

export const kimarijiCache = new Elysia({
  name: "kimarijiCache",
}).decorate({
  cache: new Cache(updateKimariji),
});
