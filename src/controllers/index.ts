import Elysia from "elysia";
import { api } from "./api";
import { bot } from "./bot";

export const controllers = new Elysia().use(bot).use(api);
