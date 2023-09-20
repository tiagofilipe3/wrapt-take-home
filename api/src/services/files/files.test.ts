import type { File } from '@prisma/client'

import { files, file, createFile, updateFile, deleteFile } from './files'
import type { StandardScenario } from './files.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('files', () => {
  scenario('returns all files', async (scenario: StandardScenario) => {
    const result = await files()

    expect(result.length).toEqual(Object.keys(scenario.file).length)
  })

  scenario('returns a single file', async (scenario: StandardScenario) => {
    const result = await file({ id: scenario.file.one.id })

    expect(result).toEqual(scenario.file.one)
  })

  scenario('creates a file', async () => {
    const result = await createFile({
      input: {
        filename: 'String',
        mimetype: 'String',
        size: 5782995,
        s3Key: 'String',
      },
    })

    expect(result.filename).toEqual('String')
    expect(result.mimetype).toEqual('String')
    expect(result.size).toEqual(5782995)
    expect(result.s3Key).toEqual('String')
  })

  scenario('updates a file', async (scenario: StandardScenario) => {
    const original = (await file({ id: scenario.file.one.id })) as File
    const result = await updateFile({
      id: original.id,
      input: { filename: 'String2' },
    })

    expect(result.filename).toEqual('String2')
  })

  scenario('deletes a file', async (scenario: StandardScenario) => {
    const original = (await deleteFile({ id: scenario.file.one.id })) as File
    const result = await file({ id: original.id })

    expect(result).toEqual(null)
  })
})
