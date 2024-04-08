import Elysia from "elysia";
import { api } from "./api";
import { bot } from "./bot";
import { html } from "./html";

export const controllers = new Elysia().use(html).use(bot).use(api);
