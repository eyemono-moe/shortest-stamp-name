import Elysia, { t } from "elysia";
import { safeParse } from "valibot";
import { kimarijiCache } from "../../cache";
import { messageSchema } from "../../libs/traq/event";
import { traqApi } from "../../libs/traqApi";

export const bot = new Elysia({ prefix: "/bot" })
  .use(kimarijiCache)
  .use(traqApi)
  .post(
    "/",
    async ({ headers, error, cache, client, body }) => {
      console.log(JSON.stringify(headers, null, 2), "\n");
      if (headers["x-traq-bot-token"] !== process.env.VERIFICATION_TOKEN) {
        return error(400, "Bad Request");
      }
      switch (headers["x-traq-bot-event"]) {
        case "PING":
          return new Response(null, { status: 204 });
        case "STAMP_CREATED": {
          // スタンプが新たに作成されたらキャッシュを更新
          await cache.update();
          return new Response(null, { status: 204 });
        }
        case "DIRECT_MESSAGE_CREATED":
        case "MENTION_MESSAGE_CREATED": {
          // メッセージが送られたら対応するスタンプの決まり字を返信する
          const message = safeParse(messageSchema, body);

          if (!message.success) {
            console.log("message parse failed: ", message.issues);
            return error(501, "Internal error");
          }

          const targetStamps = [
            ...message.output.plainText.matchAll(
              /:([a-zA-Z0-9_-]+)(?:\..+)*:/g,
            ),
          ].map((match) => match[1]);

          const kimarijiCache = await cache.get();
          const responseMessage = targetStamps
            .map((s) => [s, kimarijiCache.cache.get(s)] as const)
            .filter((k): k is [string, Set<string>] => k[1] !== undefined)
            .map(
              (k) =>
                `- :${k[0]}: \`${k[0]}\`: ${[...k[1].values()]
                  .map((kimariji) => `\`${kimariji}\``)
                  .join(", ")}`,
            )
            .join("\n");

          client.channels.postMessage(message.output.channelId, {
            content: responseMessage,
          });

          return new Response(null, { status: 204 });
        }
        default:
          // 未対応のイベント
          return error(501, "Not Implemented");
      }
    },
    {
      headers: t.Object(
        {
          "x-traq-bot-event": t.Union([
            t.Literal("PING"),
            t.Literal("STAMP_CREATED"),
            t.Literal("DIRECT_MESSAGE_CREATED"),
            t.Literal("MENTION_MESSAGE_CREATED"),
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
