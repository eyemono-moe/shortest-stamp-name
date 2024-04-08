import { html as EHtml } from "@elysiajs/html";
import Elysia from "elysia";
import { kimarijiCache } from "../../cache";

export const html = new Elysia()
  .use(EHtml())
  .use(kimarijiCache)
  .get("/", async ({ cache }) => {
    const rows = (await cache.get()).cache;

    return (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>traQ スタンプ最短検索文字列</title>
          <style type="text/css">
            {"code.kimariji:not(:last-child):after {content: ', ';}"}
          </style>
        </head>
        <body>
          <h1>traQ スタンプ最短検索文字列</h1>
          <table>
            <thead>
              <tr>
                <th>スタンプ名</th>
                <th>最短検索文字列</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr>
                  <td>
                    <code>{row.name}</code>
                  </td>
                  <td>
                    {row.kimariji.map((k) => (
                      <code class="kimariji">{k}</code>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </body>
      </html>
    );
  });
