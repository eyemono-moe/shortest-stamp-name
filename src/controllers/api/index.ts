import Elysia from "elysia";
import { kimariji } from "./kimariji";

export const api = new Elysia({ prefix: "/api" }).use(kimariji);
