import * as process from 'process'

import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { NodeJsClient } from '@smithy/types'

import { streamToString } from 'src/lib/fileHandling'

const REGION = 'sa-east-1'

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.API_KEY,
    secretAccessKey: process.env.API_SECRET,
  },
}) as NodeJsClient<S3Client>

const createReadStreamFromS3 = async (s3ObjectKey: string): Promise<string> => {
  try {
    const params = {
      Bucket: 'wrapt-bucket',
      Key: s3ObjectKey,
    }

    const { Body } = await s3Client.send(new GetObjectCommand(params))

    return await streamToString(Body)
  } catch (error) {
    console.error(error)
  }
}

// Function to calculate MD5 hash of an S3 object
const getS3ObjectMetadata = async (s3Key: string): Promise<string> => {
  const params = {
    Bucket: 'wrapt-bucket',
    Key: s3Key,
  }

  const response = await s3Client.send(new HeadObjectCommand(params))
  return response.Metadata.md5hash
}

export { s3Client, createReadStreamFromS3, getS3ObjectMetadata }
