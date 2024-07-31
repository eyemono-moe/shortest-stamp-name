export class Cache<T> {
  private cache: T | null = null;
  private lastUpdatedUTCString = "";

  constructor(private updateFunc: () => T | Promise<T>) {
    this.update();
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
    console.log("Update cache");
    this.cache = await this.updateFunc();
    this.lastUpdatedUTCString = new Date().toUTCString();
    console.log("Cache updated");
  }
}
