/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DeleteObjectCommandOutput,
  DeleteObjectsCommandOutput,
  GetObjectCommandOutput,
  ListObjectsV2CommandOutput,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import type { ObjectStorage } from "./object_storage";

export class MockObjectStorage implements Required<ObjectStorage> {
  _get = (): Promise<GetObjectCommandOutput> =>
    Promise.reject(new Error("Method not implemented."));

  get(_: { key: string; bucket?: string }): Promise<GetObjectCommandOutput> {
    return this._get();
  }

  _put = (): Promise<PutObjectCommandOutput> =>
    Promise.reject(new Error("Method not implemented."));

  put(_: {
    key: string;
    body: Buffer;
    type?: string;
    bucket?: string;
  }): Promise<PutObjectCommandOutput> {
    return this._put();
  }

  _list = (): Promise<ListObjectsV2CommandOutput> =>
    Promise.reject(new Error("Method not implemented."));

  list(_?: {
    bucket?: string;
    prefix?: string;
  }): Promise<ListObjectsV2CommandOutput> {
    return this._list();
  }

  _delete = (): Promise<DeleteObjectCommandOutput> =>
    Promise.reject(new Error("Method not implemented."));

  delete(_: {
    key: string;
    bucket?: string;
  }): Promise<DeleteObjectCommandOutput> {
    return this._delete();
  }

  _deleteMany = (): Promise<DeleteObjectsCommandOutput> =>
    Promise.reject(new Error("Method not implemented."));

  deleteMany(_: {
    keys: string[];
    bucket?: string;
  }): Promise<DeleteObjectsCommandOutput> {
    return this._deleteMany();
  }

  _destroy = () => {
    throw new Error("Method not implemented.");
  };

  destroy(): void {
    return this._destroy();
  }
}
