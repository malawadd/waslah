import axios from 'axios'

const baseUrl = '/api/'

export const carSize = async ({ string:fileUrl}) => {
  console.log('hello',fileUrl)
  const resp = await axios.post(`${baseUrl}/get-car-size`, {
     fileUrl
  })


  return resp.data
}
