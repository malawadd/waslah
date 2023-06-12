import axios from 'axios'

const baseUrl = '/api/mongodb'

export const testConnectToDB = async ({ mongoDbUri }) => {
  const resp = await axios.post(`${baseUrl}/test-connection`, {
    host: mongoDbUri,
  })

  return resp.data
}

export const migrateMongoDBToSpheronStore = async ({
  mongoConfig,
  spheronStoreConfig,
}) => {
  const resp = await axios.post(`${baseUrl}/migrate`, {
    mongoConfig,
    spheronStoreConfig,
  })

  return resp.data
}
