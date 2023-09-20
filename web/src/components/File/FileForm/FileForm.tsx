import { CSSProperties, useEffect, useMemo } from 'react'

import { useDropzone } from 'react-dropzone'
import type { EditFileById } from 'types/graphql'

import { Form, Submit } from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

import {
  acceptStyle,
  baseStyle,
  focusedStyle,
  rejectStyle,
} from 'src/components/File/FileForm/styles'
import { calculateMD5Hash } from 'src/lib/fileHandling'
import { FileInput } from 'src/types/file'

type FormFile = NonNullable<EditFileById['file']>

interface FileFormProps {
  file?: EditFileById['file']
  onSave: (data: FileInput, id?: FormFile['id']) => void
  error: RWGqlError
  loading: boolean
}

const FileForm = (props: FileFormProps) => {
  const { onSave, error, loading, file } = props

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({ maxFiles: 1, multiple: false })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  ) as CSSProperties

  const onSubmit = async () => {
    const reader = new FileReader()
    const fileToUpload = acceptedFiles[0]

    reader.onload = async () => {
      const fileData = {
        name: fileToUpload.name,
        type: fileToUpload.type,
        size: fileToUpload.size,
        dataURL: reader.result as string, // Base64 data URL
        md5Hash: await calculateMD5Hash(fileToUpload), // Calculate MD5 hash
      }

      onSave(fileData, file?.id)
    }

    reader.readAsDataURL(fileToUpload)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={error}>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {acceptedFiles.length > 0 ? (
            <div>
              {acceptedFiles.map((file) => (
                <div key={file.name}>{file.name}</div>
              ))}
            </div>
          ) : (
            <p>
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
          )}
        </div>

        <div className="rw-button-group">
          <Submit disabled={loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default FileForm
