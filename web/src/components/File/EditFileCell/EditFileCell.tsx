import type { EditFileById } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FileForm from 'src/components/File/FileForm'
import { FileInput } from 'src/types/file'

export const QUERY = gql`
  query EditFileById($id: Int!) {
    file: file(id: $id) {
      id
      filename
      mimetype
      size
      version
      createdAt
    }
  }
`
const UPDATE_FILE_MUTATION = gql`
  mutation UpdateFileMutation($id: Int!, $file: FileInput!) {
    updateFile(id: $id, file: $file) {
      id
      filename
      mimetype
      size
      version
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ file }: CellSuccessProps<EditFileById>) => {
  const [updateFile, { loading, error }] = useMutation(UPDATE_FILE_MUTATION, {
    onCompleted: () => {
      toast.success('File updated')
      navigate(routes.files())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (file: FileInput, id: EditFileById['file']['id']) => {
    updateFile({ variables: { id, file } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit File {file?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <FileForm file={file} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
