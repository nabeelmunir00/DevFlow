import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class R2StorageService implements OnModuleInit {
  private readonly logger = new Logger(R2StorageService.name);

  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.getOrThrow<string>('R2_ENDPOINT');

    const accessKeyId =
      this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID');

    const secretAccessKey = this.configService.getOrThrow<string>(
      'R2_SECRET_ACCESS_KEY',
    );

    this.bucketName = this.configService.getOrThrow<string>('R2_BUCKET_NAME');

    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.client.send(
        new HeadBucketCommand({
          Bucket: this.bucketName,
        }),
      );

      this.logger.log(`Connected to R2 bucket: ${this.bucketName}`);
    } catch (error) {
      this.logger.error('Failed to connect to Cloudflare R2', error);
    }
  }

  async upload(key: string, body: Buffer, contentType: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );

    return { key };
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  async getDownloadUrl(key: string, expiresIn = 300) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.client, command, {
      expiresIn,
    });
  }
}
