export const schema = gql`
  input FileInput {
    name: String!
    type: String!
    size: Int!
    dataURL: String!
    md5Hash: String!
  }

  type File {
    id: Int!
    filename: String!
    mimetype: String!
    size: Int!
    version: String!
    createdAt: DateTime
  }

  type Query {
    files: [File!]! @requireAuth
    file(id: Int!): File @requireAuth
  }

  type Mutation {
    createFile(file: FileInput!): File! @requireAuth
    updateFile(id: Int!, file: FileInput!): File! @requireAuth
    deleteFile(id: Int!): File! @requireAuth
    singleUpload(file: FileInput!): File! @requireAuth
  }
`
