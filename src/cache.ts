import Elysia from "elysia";
import { calcKimariji } from "./libs/calcKimariji";

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

class KimarijiCache {
  private cache: Awaited<ReturnType<typeof calcKimariji>> | null = null;
  private lastUpdatedUTCString = "";

  constructor() {
    this.update().then(() => {
      console.log("Cache initialized", this.lastUpdatedUTCString);
    });
  }

  public async get() {
    if (this.cache === null) {
      await this.update();
    }
    if (this.cache === null) {
      throw new Error("Failed to update cache");
    }
    return {
      cache: this.cache,
      lastUpdated: this.lastUpdatedUTCString,
    };
  }

  public async update() {
    const TOKEN = process.env.BOT_ACCESS_TOKEN;
    if (TOKEN === undefined) {
      throw new Error("TOKEN is not defined");
    }
    const [stamps, altNames] = await Promise.all([
      getStamps(TOKEN),
      getAltnameTable(),
    ]);

    this.cache = calcKimariji(stamps, altNames);
    this.lastUpdatedUTCString = new Date().toUTCString();
    console.log("Cache updated", this.lastUpdatedUTCString);
  }
}

export const kimarijiCache = new Elysia({
  name: "kimarijiCache",
}).decorate({
  cache: new KimarijiCache(),
});
