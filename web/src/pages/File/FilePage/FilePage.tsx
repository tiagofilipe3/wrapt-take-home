import FileCell from 'src/components/File/FileCell'

type FilePageProps = {
  id: number
}

const FilePage = ({ id }: FilePageProps) => {
  return <FileCell id={id} />
}

export default FilePage
