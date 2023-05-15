import { expect } from "chai";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ObjectStorage } from "../src/object_storage";

describe("ObjectStorage", () => {
  // Configuration for Cloudflare's R2 API
  const storage = new ObjectStorage({
    region: "auto",
    endpoint: process.env.ENDPOINT,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
    },
    defaultBucket: "test",
  });
  const body = readFileSync(join("test", "assets", "logo.png"));

  describe("put", () => {
    it("stores object in a bucket", async () => {
      const key = randomBytes(12).toString("hex");
      const response = await storage.put({ key, body, type: "image/png" });
      expect(response.$metadata.httpStatusCode).to.equal(200);
    });
  });

  describe("get", () => {
    it("retrieves object from a bucket", async () => {
      const key = randomBytes(12).toString("hex");

      const putResponse = await storage.put({ key, body, type: "image/png" });
      expect(putResponse.$metadata.httpStatusCode).to.equal(200);

      const getResponse = await storage.get({ key });
      expect(getResponse.$metadata.httpStatusCode).to.equal(200);
      expect(getResponse.Body).to.not.be.undefined;
    });
  });

  describe("list", () => {
    it("retrieves list of object metadata", async () => {
      const key = randomBytes(12).toString("hex");

      const putResponse = await storage.put({ key, body, type: "image/png" });
      expect(putResponse.$metadata.httpStatusCode).to.equal(200);

      const listResponse = await storage.list({});
      expect(listResponse.$metadata.httpStatusCode).to.equal(200);
      expect(listResponse.Contents).to.not.be.undefined;
    });
  });

  describe("delete", () => {
    it("removes single object from a bucket", async () => {
      const key = randomBytes(12).toString("hex");

      const putResponse = await storage.put({ key, body, type: "image/png" });
      expect(putResponse.$metadata.httpStatusCode).to.equal(200);

      const deleteResponse = await storage.delete({ key });
      expect(deleteResponse.$metadata.httpStatusCode).to.equal(204);
    });
  });

  describe("deleteMany", () => {
    it("removes multiple objects from a bucket", async () => {
      const key = randomBytes(12).toString("hex");

      const putResponse = await storage.put({ key, body, type: "image/png" });
      expect(putResponse.$metadata.httpStatusCode).to.equal(200);

      const deleteResponse = await storage.deleteMany({ keys: [key] });
      expect(deleteResponse.$metadata.httpStatusCode).to.equal(200);
      expect(deleteResponse.Deleted?.[0].Key).to.equal(key);
    });
  });

  after(async () => {
    const objects = (await storage.list({})).Contents ?? [];
    const keys: string[] = [];
    for (const obj of objects) {
      if (obj.Key) keys.push(obj.Key);
    }
    await storage.deleteMany({ keys });
    storage.destroy();
  });
});
