import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FileForm from 'src/components/File/FileForm'
import { FileInput } from 'src/types/file'

const CREATE_FILE_MUTATION = gql`
  mutation CreateFileMutation($file: FileInput!) {
    createFile(file: $file) {
      id
    }
  }
`

const NewFile = () => {
  const [createFile, { loading, error }] = useMutation(CREATE_FILE_MUTATION, {
    onCompleted: () => {
      toast.success('File created')
      navigate(routes.files())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = async (file: FileInput) => {
    createFile({ variables: { file } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New File</h2>
      </header>
      <div className="rw-segment-main">
        <FileForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewFile
