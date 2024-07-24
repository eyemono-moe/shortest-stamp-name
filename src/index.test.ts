import { describe, expect, test } from "bun:test";
import { app } from ".";

describe("Elysia", () => {
  describe("bot endpoint", async () => {
    const VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN;
    if (VERIFICATION_TOKEN === undefined) {
      throw new Error("VERIFICATION_TOKEN is not defined");
    }

    test("POST /bot/ with invalid token should return 400", async () => {
      const res = await app.handle(
        new Request("http://localhost:3000/bot/", {
          method: "POST",
          headers: {
            "x-traq-bot-event": "PING",
            "x-traq-bot-token": "invalid",
            "x-traq-bot-request-id": "test",
          },
          body: JSON.stringify({
            eventTime: new Date().toISOString(),
          }),
        }),
      );

      expect(res.status).toBe(400);
    });

    test("PING should return 204", async () => {
      const res = await app.handle(
        new Request("http://localhost:3000/bot/", {
          method: "POST",
          headers: {
            "x-traq-bot-event": "PING",
            "x-traq-bot-token": VERIFICATION_TOKEN,
            "x-traq-bot-request-id": "test",
          },
          body: JSON.stringify({
            eventTime: new Date().toISOString(),
          }),
        }),
      );

      expect(res.status).toBe(204);
    });

    test("STAMP_CREATED should return 204", async () => {
      const res = await app.handle(
        new Request("http://localhost:3000/bot/", {
          method: "POST",
          headers: {
            "x-traq-bot-event": "STAMP_CREATED",
            "x-traq-bot-token": VERIFICATION_TOKEN,
            "x-traq-bot-request-id": "test",
          },
          body: JSON.stringify({
            eventTime: new Date().toISOString(),
            id: "2bc06cda-bdb9-4a68-8000-62f907f36a92",
            name: "naruhodo",
            fileId: "2bc06cda-bdb9-4a68-8000-62f907f36a92",
            creator: {
              id: "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
              name: "takashi_trap",
              displayName: "",
              iconId: "2bc06cda-bdb9-4a68-8000-62f907f36a92",
              bot: false,
            },
          }),
        }),
      );

      expect(res.status).toBe(204);
    });
  });
});
