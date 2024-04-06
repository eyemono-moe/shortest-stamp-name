import Elysia, { t } from "elysia";
import { kimarijiCache } from "../../cache";

export const bot = new Elysia({ prefix: "/bot" }).use(kimarijiCache).post(
  "/",
  async ({ headers, error, cache }) => {
    if (headers["x-traq-bot-token"] !== process.env.VERIFICATION_TOKEN) {
      error(400, "Bad Request");
    }
    switch (headers["x-traq-bot-event"]) {
      case "PING":
        return new Response(null, { status: 204 });
      case "STAMP_CREATED": {
        // スタンプが新たに作成されたらキャッシュを更新
        await cache.update();
        return new Response(null, { status: 204 });
      }
      default:
        // 未対応のイベント
        return new Response(null, { status: 204 });
    }
  },
  {
    headers: t.Object(
      {
        "x-traq-bot-event": t.Union([
          t.Literal("PING"),
          t.Literal("STAMP_CREATED"),
        ]),
        "x-traq-bot-token": t.String(),
        "x-traq-bot-request-id": t.String(),
      },
      {
        additionalProperties: true,
      },
    ),
    detail: {
      description: "bot用イベントエンドポイント",
    },
  },
);
