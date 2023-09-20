import type { Prisma, File } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.FileCreateArgs>({
  file: {
    one: {
      data: {
        filename: 'String',
        mimetype: 'String',
        size: 5052636,
        s3Key: 'String',
      },
    },
    two: {
      data: {
        filename: 'String',
        mimetype: 'String',
        size: 9958481,
        s3Key: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<File, 'file'>
