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
        }),
      );

      expect(res.status).toBe(204);
    });
  });
});
