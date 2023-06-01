import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandInputType,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";

export interface ObjectStorageConfig extends S3ClientConfig {
  defaultBucket: string;
}

export class ObjectStorage {
  readonly #client: S3Client;
  readonly #defaultBucket: string;

  constructor(config: ObjectStorageConfig) {
    const { defaultBucket, ...clientConfig } = config;
    this.#client = new S3Client(clientConfig);
    this.#defaultBucket = defaultBucket;
  }

  get(params: { key: string; bucket?: string }) {
    const command = new GetObjectCommand({
      Bucket: params.bucket ?? this.#defaultBucket,
      Key: params.key,
    });
    return this.#client.send(command);
  }

  put(params: {
    key: string;
    body: PutObjectCommandInputType["Body"];
    type?: string;
    bucket?: string;
  }) {
    const command = new PutObjectCommand({
      Bucket: params.bucket ?? this.#defaultBucket,
      Key: params.key,
      Body: params.body,
      ContentType: params?.type,
    });
    return this.#client.send(command);
  }

  list(params?: { bucket?: string; prefix?: string }) {
    const command = new ListObjectsV2Command({
      Bucket: params?.bucket ?? this.#defaultBucket,
      Prefix: params?.prefix,
    });
    return this.#client.send(command);
  }

  delete(params: { key: string; bucket?: string }) {
    const command = new DeleteObjectCommand({
      Bucket: params.bucket ?? this.#defaultBucket,
      Key: params.key,
    });
    return this.#client.send(command);
  }

  deleteMany(params: { keys: string[]; bucket?: string }) {
    const command = new DeleteObjectsCommand({
      Bucket: params.bucket ?? this.#defaultBucket,
      Delete: {
        Objects: params.keys.map((Key) => ({ Key })),
      },
    });
    return this.#client.send(command);
  }

  destroy() {
    this.#client.destroy();
  }
}
