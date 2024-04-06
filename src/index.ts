import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { controllers } from "./controllers";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Stamp Kimariji API",
          version: "0.0.1",
        },
      },
    }),
  )
  .use(controllers)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
