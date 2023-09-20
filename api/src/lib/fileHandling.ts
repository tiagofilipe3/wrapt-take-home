import crypto from 'crypto'
import { Readable } from 'stream'

const calculateFileHash = async (fileData: Readable): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5') // You can choose a different hash algorithm if needed

    fileData.on('data', (chunk) => {
      hash.update(chunk)
    })

    fileData.on('end', () => {
      const fileHash = hash.digest('hex')
      resolve(fileHash)
    })

    fileData.on('error', (error) => {
      reject(error)
    })
  })
}

const createReadStreamFromBase64 = (base64Data: string): Readable => {
  const binaryData = Buffer.from(base64Data, 'base64')
  const readableStream = new Readable()
  readableStream.push(binaryData)
  readableStream.push(null) // Signal the end of the stream
  return readableStream
}

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })

export { calculateFileHash, createReadStreamFromBase64, streamToString }
