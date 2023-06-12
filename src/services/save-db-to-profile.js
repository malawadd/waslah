import axios from 'axios'

const baseUrl = '/api/spheronstore'

export const saveDbToProfile = async ({ dbDetails }) => {
  const resp = await axios.post(`${baseUrl}/connect`, dbDetails, {
    validateStatus: (status) => status < 500,
  })

  return resp.data
}

export const fetchMySpheronStoreDatabases = async () => {
  try {
    const resp = await axios.get(`${baseUrl}/list-dbs`)
    return resp.data
  } catch (err) {
    return err
  }
}
