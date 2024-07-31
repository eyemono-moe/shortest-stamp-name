import Elysia from "elysia";
import { kimarijiCache } from "../../kimarijiCache";
import { sortedKimariji } from "../../libs/calcKimariji";

export const kimariji = new Elysia({ prefix: "/kimariji" })
  .use(kimarijiCache)
  .get(
    "/",
    async ({ set, cache, headers }) => {
      const { cache: cachedKimariji, lastUpdated } = await cache.get();
      if (headers["if-modified-since"]) {
        if (lastUpdated <= headers["if-modified-since"]) {
          return new Response(null, { status: 304 });
        }
      }
      set.headers["Last-Modified"] = lastUpdated;
      return sortedKimariji(cachedKimariji);
    },
    {
      detail: {
        description: "traQ上の全スタンプについての最短検索文字列を取得します。",
        responses: {
          200: {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      kimariji: { type: "array", items: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  );
