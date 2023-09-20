import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { UserInputError } from '@redwoodjs/graphql-server'

import { getS3ObjectMetadata, s3Client } from 'src/lib/aws'
import { db } from 'src/lib/db'
import { createReadStreamFromBase64 } from 'src/lib/fileHandling'

export const files: QueryResolvers['files'] = () => {
  return db.file.findMany()
}

export const file: QueryResolvers['file'] = ({ id }) => {
  return db.file.findUnique({
    where: { id },
  })
}

export const createFile: MutationResolvers['createFile'] = async ({ file }) => {
  const { name, type, size, dataURL, md5Hash } = file

  const existingFile = await db.file.findFirst({
    where: { filename: name },
  })

  // If there's a file with the same
  if (existingFile) {
    const metadata = await getS3ObjectMetadata(existingFile.s3Key)

    if (metadata === md5Hash) {
      // Content hasn't changed, so return the existing file
      throw new UserInputError('File content has not changed')
    }

    const newVersion = Number(existingFile.version) + 1

    // Content has changed, increment the version and update S3 object key
    const newFile = {
      filename: name,
      mimetype: type,
      size,
      version: newVersion.toString(),
      s3Key: `v${newVersion}_${name}`,
    }

    // Update the file in S3
    const params = {
      Bucket: 'wrapt-bucket',
      Key: newFile.s3Key,
      Body: createReadStreamFromBase64(dataURL),
      ContentLength: size,
    }
    await s3Client.send(new PutObjectCommand(params))

    // Create a new file in the database
    return db.file.create({
      data: newFile,
    })
  } else {
    // Create a new file entry
    const newFile = {
      filename: name,
      mimetype: type,
      size,
      version: '1',
      s3Key: `v1_${name}`,
    }

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: 'wrapt-bucket',
          Key: newFile.s3Key,
          Body: createReadStreamFromBase64(dataURL),
          ContentLength: size,
          Metadata: {
            md5Hash,
          },
        })
      )
    } catch (error) {
      console.error(error)
    }

    // Add the new file to the database
    return db.file.create({
      data: newFile,
    })
  }
}

export const updateFile: MutationResolvers['updateFile'] = async ({
  id,
  file,
}) => {
  const { name, type, size, dataURL, md5Hash } = file

  const existingFile = await db.file.findUnique({
    where: { id },
  })

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: 'wrapt-bucket',
      Key: existingFile.s3Key,
    })
  )

  // Create a new file entry
  const newFile = {
    filename: name,
    mimetype: type,
    size,
    version: '1',
    s3Key: `v1_${name}`,
  }

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: 'wrapt-bucket',
        Key: newFile.s3Key,
        Body: createReadStreamFromBase64(dataURL),
        ContentLength: size,
        Metadata: {
          md5Hash,
        },
      })
    )
  } catch (error) {
    console.error(error)
  }

  // Add the new file to the database
  return db.file.update({
    data: newFile,
    where: { id },
  })
}

export const deleteFile: MutationResolvers['deleteFile'] = async ({ id }) => {
  const existingFile = await db.file.findUnique({
    where: { id },
  })

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'wrapt-bucket',
        Key: existingFile.s3Key,
      })
    )
  } catch (error) {
    console.error(error)
  }

  return db.file.delete({
    where: { id },
  })
}
