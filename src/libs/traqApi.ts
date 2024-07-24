import Elysia from "elysia";
import { Api } from "./traq/api";

const createApiClient = () => {
  const TOKEN = process.env.BOT_ACCESS_TOKEN;
  if (TOKEN === undefined) {
    throw new Error("TOKEN is not defined");
  }
  return new Api({
    baseApiParams: {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  });
};

export const traqApi = new Elysia({
  name: "traqApiClient",
}).decorate({
  client: createApiClient(),
});
