import Elysia from "elysia";
import { calcKimariji } from "./libs/calcKimariji";

class KimarijiCache {
  private cache: Awaited<ReturnType<typeof calcKimariji>> | null = null;
  private lastUpdatedUTCString = "";

  constructor() {
    this.update().then(() => {
      console.log("Cache initialized", this.lastUpdatedUTCString);
    });
  }

  public async get() {
    if (this.cache === null) {
      await this.update();
    }
    if (this.cache === null) {
      throw new Error("Failed to update cache");
    }
    return {
      cache: this.cache,
      lastUpdated: this.lastUpdatedUTCString,
    };
  }

  public async update() {
    this.cache = await calcKimariji();
    this.lastUpdatedUTCString = new Date().toUTCString();
  }
}

export const kimarijiCache = new Elysia({
  name: "kimarijiCache",
}).decorate({
  cache: new KimarijiCache(),
});
