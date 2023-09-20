import SparkMD5 from 'spark-md5'

const calculateMD5Hash = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const blobSlice = File.prototype.slice
    const chunkSize = 2097152 // 2MB chunks (adjust as needed)
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()

    const fileReader = new FileReader()

    fileReader.onload = function (e) {
      spark.append(e.target!.result as ArrayBuffer)
      currentChunk++

      if (currentChunk < chunks) {
        loadNextChunk()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = function () {
      reject('Error reading file')
    }

    function loadNextChunk() {
      const start = currentChunk * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNextChunk()
  })
}

export { calculateMD5Hash }
