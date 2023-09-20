import EditFileCell from 'src/components/File/EditFileCell'

type FilePageProps = {
  id: number
}

const EditFilePage = ({ id }: FilePageProps) => {
  return <EditFileCell id={id} />
}

export default EditFilePage
